const CLOUDINARY_UPLOAD_URL =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL ||
  "https://api.cloudinary.com/v1_1/gwxzzptn/image/upload";

const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "mini-shop";

type CloudinaryUploadResponse = {
  secure_url?: string;
  error?: {
    message?: string;
  };
};

export async function uploadImageToCloudinary(file: File): Promise<string> {
  if (!CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("Thiếu upload preset Cloudinary.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", "minishop");

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  const data = (await response.json()) as CloudinaryUploadResponse;

  if (!response.ok || !data.secure_url) {
    throw new Error(data.error?.message || "Không thể tải ảnh lên Cloudinary.");
  }

  return data.secure_url;
}
