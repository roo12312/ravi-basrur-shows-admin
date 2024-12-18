import React, { memo, useMemo, useState } from "react";
import { Dashboard } from "@uppy/react";
import Uppy from "@uppy/core";
import ImageEditor from "@uppy/image-editor";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/image-editor/dist/style.min.css";
import Compressor from "@uppy/compressor";
import { ControllerRenderProps } from "react-hook-form";
import useFetchStorage from "@/hooks/supabase/useFetchStorage";
import { Button } from "./button";

export default function UppyComponent({
  field,
  aspectRatio = 1 / 1,
  bucket,
  editOnSelect = true,
}: {
  field: ControllerRenderProps<any, any>;
  aspectRatio?: number;
  bucket: string;
  editOnSelect?: boolean;
}) {
  const uppy = useMemo(
    () =>
      new Uppy({
        restrictions: {
          maxNumberOfFiles: 1,
          allowedFileTypes: ["image/*"],
        },
        allowMultipleUploadBatches: false,
        id: "mediaImage",
        // debug: true,

        autoProceed: false,
      })
        .on("file-added", () => {
          if (!editOnSelect) uppy.upload();
        })
        .use(ImageEditor, {
          target: "",
          cropperOptions: {
            aspectRatio: aspectRatio,
            croppedCanvasOptions: {},
          },

          actions: {
            cropSquare: false,
            cropWidescreen: false,
            cropWidescreenVertical: false,
            revert: true,
            rotate: true,
            granularRotate: true,
            flip: true,
            zoomIn: true,
            zoomOut: true,
          },
        })
        .on("file-removed", (updatedFile) => {
          // Access uploaded image data

          field.onChange();
        })
        .use(Compressor, {
          maxWidth: 1500,
          maxHeight: 1500,
        })
        .on("complete", (result) => {
          const uploadedFile = result.successful[0];

          console.log({ uploadedFile, field });
          field.onChange(uploadedFile);
        })
        .on("file-editor:complete", (updatedFile) => {
          uppy.upload();
        }),
    []
  );

  const img = useFetchStorage({ url: field.value, bucket });

  // console.log("sdfdsf", field.value);

  if (typeof field.value == "string" && field.value !== "" && !img.isError) {
    return (
      <div
        className=" flex justify-center items-center gap-5 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50
      "
      >
        {img.url && (
          <img src={img.url} className=" w-[100px] h-full object-cover" />
        )}
        <Button
          onClick={() => {
            field.onChange(null);
          }}
        >
          Reselect
        </Button>
      </div>
    );
  }

  return (
    <Dashboard
      id="mediaImage"
      uppy={uppy}
      width={"100%"}
      plugins={["ImageEditor"]}
      proudlyDisplayPoweredByUppy={false}
      hideUploadButton={true}
      autoOpenFileEditor={editOnSelect}
    />
  );
}
