"use client";

import React, { useState } from "react";
import { X, MessageSquare } from "lucide-react";
import { RatingStars } from "./RatingStars";
import { createReviewApi } from "@/features/reviews/review.api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface ReviewModalProps {
  isOpen: boolean;
  productId: number;
  productName: string;
  orderId?: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ReviewModal({
  isOpen,
  productId,
  productName,
  orderId,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá cảm nhận của bạn!");
      return;
    }

    setIsSubmitting(true);
    try {
      await createReviewApi({
        product_id: productId,
        order_id: orderId,
        rating,
        comment: comment.trim(),
      });

      toast.success("Cảm ơn bạn đã gửi đánh giá sản phẩm! 🌟");
      setComment("");
      setRating(5);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Không thể gửi đánh giá");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-shopee-orange font-bold text-lg">
            <MessageSquare className="w-5 h-5" />
            <span>Đánh Giá Sản Phẩm</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Sản phẩm đánh giá
            </p>
            <p className="font-bold text-slate-800 text-sm mt-0.5">{productName}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block">
              Chất lượng sản phẩm
            </label>
            <div className="flex items-center gap-3 bg-orange-50/60 p-3 rounded-2xl border border-orange-100">
              <RatingStars rating={rating} size="lg" interactive onRate={setRating} />
              <span className="text-sm font-bold text-orange-600">
                {rating === 5
                  ? "Cực kỳ hài lòng ★★★★★"
                  : rating === 4
                  ? "Hài lòng ★★★★☆"
                  : rating === 3
                  ? "Bình thường ★★★☆☆"
                  : rating === 2
                  ? "Chưa hài lòng ★★☆☆☆"
                  : "Rất tệ ★☆☆☆☆"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block">
              Chia sẻ cảm nhận chi tiết
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Hãy chia sẻ trải nghiệm về chất liệu, kiểu dáng, tốc độ giao hàng hoặc thái độ phục vụ..."
              className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-shopee-orange focus:bg-white transition resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-shopee-orange text-white font-bold text-sm rounded-xl shadow-md hover:bg-shopee-hover transition active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi Đánh Giá Ngay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
