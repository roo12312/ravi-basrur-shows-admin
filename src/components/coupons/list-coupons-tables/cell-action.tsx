"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useDeleteSingleFile from "@/hooks/supabase/useDeleteSingleFile";
import useMutationData from "@/hooks/supabase/useMutationData";
import { supabase } from "@/lib/supabase/client";
import { Tables } from "@/types/database.types";
import {
  Edit,
  MoreHorizontal,
  Trash,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CellActionProps {
  data: Tables<"coupons">;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const mutate = useMutationData();
  const pathName = usePathname();
  const deleteFile = useDeleteSingleFile();

  const onDeleteConfirm = async () => {
    setLoading(true);
    try {
      // If deleting the file, ensure the correct logic is applied (if applicable)
      // const deleteF = await deleteFile({
      //   fileUrl: data.ad_content.data,
      //   bucket: "ads",
      // });

      // Deleting the coupon record
      const rsp = await mutate.mutateAsync({
        query: supabase
          .from("coupons")
          .delete()
          .match({
            id: data.id,
          })
          .select("*"),
      });

      toast("Coupon deleted successfully.");
      setOpen(false);
    } catch (err) {
      console.log("Coupon delete error", err);
      toast.error("Something went wrong.");
    }
    setLoading(false);
  };

  const toggleDraftStatus = async () => {
    setLoading(true);
    try {
      const updatedDraftStatus = !data.is_draft;

      // Update the draft status of the coupon
      const rsp = await mutate.mutateAsync({
        query: supabase
          .from("coupons")
          .update({ is_draft: updatedDraftStatus })
          .match({ id: data.id })
          .select("*"),
      });

      toast(
        `Coupon status updated to ${
          updatedDraftStatus ? "Draft" : "Published"
        }.`
      );
    } catch (err) {
      console.log("Draft toggle error", err);
      toast.error("Something went wrong while updating draft status.");
    }
    setLoading(false);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDeleteConfirm}
        loading={loading}
        title={`Are you sure you want to delete Coupon ${data.coupon}?`}
        description="This Cannot Be Undone"
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {/* Edit Action */}
          <DropdownMenuItem
            onClick={() => router.push(pathName + "?edit_coupon=" + data.id)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>

          {/* Toggle Draft Status Action */}
          <DropdownMenuItem onClick={toggleDraftStatus}>
            {data.is_draft ? (
              <CheckCircle className="mr-2 h-4 w-4" />
            ) : (
              <XCircle className="mr-2 h-4 w-4" />
            )}
            {data.is_draft ? "Publish" : "Set as Draft"}
          </DropdownMenuItem>

          {/* Delete Action */}
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
