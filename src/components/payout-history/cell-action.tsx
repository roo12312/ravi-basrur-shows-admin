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

import useMutationData from "@/hooks/supabase/useMutationData";
import { supabase } from "@/lib/supabase/client";
import { Tables } from "@/types/database.types";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CellActionProps {
  data: Tables<"movies">;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const mutate = useMutationData();
  const pathName = usePathname();

  return (
    <>
      <Button
        variant="ghost"
        className="h-8 w-8 p-0"
        onClick={() => {
          router.push("/dashboard/users/" + data.id);
        }}
      >
        View
      </Button>
    </>
  );
};
