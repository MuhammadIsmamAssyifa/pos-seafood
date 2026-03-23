"use client";

import { useState } from "react";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { UploadCloud, CheckCircle } from "lucide-react";

export default function MenuForm() {
  const [publicId, setPublicId] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed rounded-xl p-6 bg-slate-50 text-center">
        {publicId ? (
          <div className="flex flex-col items-center gap-4">
            {/* Pakai CldImage yang kamu temukan di dokumentasi */}
            <CldImage
              width="300"
              height="300"
              src={publicId}
              alt="Foto Menu"
              crop="fill"
              className="rounded-lg object-cover"
            />
            <p className="text-green-600 flex items-center gap-2 font-bold">
              <CheckCircle className="w-4 h-4" /> Foto Berhasil Diunggah!
            </p>
            <Button variant="outline" onClick={() => setPublicId("")}>
              Ganti Foto
            </Button>
          </div>
        ) : (
          /* Widget Upload Bawaan Cloudinary */
          <CldUploadWidget
            uploadPreset="my_usigned_preset" // Ganti dengan 'ml_default' atau nama yang kamu buat
            onSuccess={(result: any) => {
              // result.info.secure_url adalah link gambar (https://...)
              // result.info.public_id adalah ID unik gambar di Cloudinary
              setImageUrl(result.info.secure_url);
              setPublicId(result.info.public_id);
              console.log("Upload Berhasil:", result.info.secure_url);
            }}
            options={{
              sources: ["local", "camera"],
              multiple: false,
              maxFiles: 1,
              clientAllowedFormats: ["png", "jpeg", "jpg"],
            }}
          >
            {({ open }) => (
              <Button
                type="button"
                variant="outline"
                onClick={() => open()}
                className="w-full py-12 border-dashed border-2 hover:border-orange-500 transition-all"
              >
                <div className="flex flex-col items-center gap-2">
                  <UploadCloud className="w-8 h-8 text-slate-400" />
                  <span className="font-bold text-slate-600">
                    Pilih Foto Makanan
                  </span>
                </div>
              </Button>
            )}
          </CldUploadWidget>
        )}
      </div>

      {/* Input hidden untuk menyimpan publicId ke database nanti */}
      <input type="hidden" name="imageUrl" value={publicId} />
    </div>
  );
}
