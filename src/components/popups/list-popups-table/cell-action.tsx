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
import { Edit, MoreHorizontal, Trash, CheckCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CellActionProps {
  data: Tables<"popups">;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const mutate = useMutationData();
  const pathName = usePathname();
  const deleteFile = useDeleteSingleFile();

  const onConfirm = async () => {
    setLoading(true);
    try {
      // Delete associated images
      const mobileImageDelete = await deleteFile({
        fileUrl: data.content.media["mobileImage-9x16"],
        bucket: "popups_images",
      });

      const desktopImageDelete = await deleteFile({
        fileUrl: data.content.media["desktop-image-16x9"],
        bucket: "popups_images",
      });

      // Delete popup record
      const rsp = await mutate.mutateAsync({
        query: supabase
          .from("popups")
          .delete()
          .match({
            id: data.id,
          })
          .select("*"),
        deleteId: data.id,
      });

      toast("Popup deleted successfully.");
      setOpen(false);
    } catch (err) {
      toast.error("Something went wrong.");
    }
    setLoading(false);
  };

  const toggleDraftStatus = async () => {
    setLoading(true);
    try {
      const updatedData = await mutate.mutateAsync({
        query: supabase
          .from("popups")
          .update({
            is_draft: !data.is_draft,
          })
          .eq("id", data.id)
          .select("*"),
      });

      const newStatus = !data.is_draft ? "Published" : "Draft";
      toast(`Popup status changed to ${newStatus}.`);
    } catch (err) {
      toast.error("Failed to update status.");
    }
    setLoading(false);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title={`Are you sure you want to delete Popup "${data.title}"?`}
        description="This action cannot be undone."
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

          <DropdownMenuItem
            onClick={() => router.push(pathName + "?edit_popup=" + data.id)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleDraftStatus}>
            <CheckCircle className="mr-2 h-4 w-4" />
            {data.is_draft ? "Publish" : "Move to Draft"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
