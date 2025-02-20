"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Trash2 } from "lucide-react";
import { db } from "@/db/dbConfig";
import { Single } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  singleId: string;
  currentUser: string;
};

export default function DeleteSingle({ singleId, currentUser }: Props) {
  const router = useRouter();

  //Delete single
  const deleteSingle = async (singleId: string) => {
    const result = await db
      .delete(Single)
      .where(and(eq(Single.id, singleId), eq(Single.created_by, currentUser)))
      .returning();

    if (result) {
      toast.success("Single Payment Deleted!");
      router.refresh();
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex h-fit w-full items-center justify-start gap-2 rounded-md bg-transparent px-0 py-2 text-sm font-normal text-foreground hover:bg-neutral-200">
        <span className="pl-4">
          <Trash2 strokeWidth={2} className="h-4 w-4" color="#555353" />
        </span>
        <span className="font-semibold text-secondary-foreground">Delete</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Single</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this single payment? This action
            cannot be undone. Click &apos;Delete&apos; to confirm this action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => deleteSingle(singleId)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
