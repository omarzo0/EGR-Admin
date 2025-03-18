"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Button } from "../../../lib/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../lib/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../lib/ui/tabs";
import { FileUp, FileDown, CheckCircle, AlertCircle } from "lucide-react";

export default function SignDocument() {
  const [activeTab, setActiveTab] = useState("download");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentStatus, setDocumentStatus] = useState("processing");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDownload = () => {
    // In a real application, this would download the actual document
    // For this example, we'll just simulate the download
    const link = document.createElement("a");
    link.href = document.fileUrl;
    link.download = `${document.title.replace(/\s+/g, "-").toLowerCase()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Move to the next tab after download
    setTimeout(() => {
      setActiveTab("upload");
    }, 1000);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);

    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setUploadComplete(true);
      setDocumentStatus("signed");
      setActiveTab("status");
    }, 2000);
  };

  const handleUpdateStatus = (status) => {
    setIsSubmitting(true);
    setDocumentStatus(status);

    // Simulate processing
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Process Document</h2>
          <p className="text-gray-600">
            {document.title} - Submitted by {document.citizenName}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Document Preview</CardTitle>
              </CardHeader>
              <CardContent className="relative min-h-[600px]">
                <div className="relative h-full w-full overflow-auto rounded border bg-white p-4">
                  <img
                    src={document.fileUrl || "/placeholder.svg"}
                    alt="Document Preview"
                    className="mx-auto block"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Document Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Document Title
                    </h3>
                    <p>{document.title}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Citizen
                    </h3>
                    <p>
                      {document.citizenName} ({document.citizenId})
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Date Submitted
                    </h3>
                    <p>{document.dateSubmitted}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Department
                    </h3>
                    <p>{document.department}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Manual Document Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4 grid w-full grid-cols-3">
                    <TabsTrigger value="download">Download</TabsTrigger>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                    <TabsTrigger value="status">Status</TabsTrigger>
                  </TabsList>

                  <TabsContent value="download">
                    <div className="space-y-4">
                      <div className="rounded-lg bg-blue-50 p-4 text-blue-800">
                        <h3 className="mb-2 font-medium">
                          Manual Signing Process
                        </h3>
                        <ol className="ml-4 list-decimal space-y-1 text-sm">
                          <li>Download the document</li>
                          <li>Print and sign it manually</li>
                          <li>Scan the signed document</li>
                          <li>Upload the scanned document</li>
                        </ol>
                      </div>
                      <Button onClick={handleDownload} className="w-full">
                        <FileDown className="mr-2 h-4 w-4" />
                        Download Document
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="upload">
                    <div className="space-y-4">
                      <div className="rounded-lg border border-dashed border-gray-300 p-4">
                        {selectedFile ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileUp className="h-5 w-5 text-blue-500" />
                              <span className="font-medium">
                                {selectedFile.name}
                              </span>
                              <span className="text-sm text-gray-500">
                                ({Math.round(selectedFile.size / 1024)} KB)
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedFile(null)}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600"
                              >
                                <span>Upload signed document</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={handleFileChange}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PDF, JPG, JPEG, or PNG up to 10MB
                            </p>
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={handleUpload}
                        className="w-full"
                        disabled={!selectedFile || isUploading}
                      >
                        {isUploading
                          ? "Uploading..."
                          : "Upload Signed Document"}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="status">
                    <div className="space-y-4">
                      {uploadComplete ? (
                        <div className="rounded-lg bg-green-50 p-4 text-center">
                          <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
                          <h3 className="mt-2 font-medium text-green-800">
                            Document Uploaded Successfully
                          </h3>
                          <p className="mt-1 text-sm text-green-600">
                            Current status:{" "}
                            <span className="font-medium">
                              {documentStatus}
                            </span>
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-lg bg-yellow-50 p-4 text-center">
                          <AlertCircle className="mx-auto h-8 w-8 text-yellow-500" />
                          <h3 className="mt-2 font-medium text-yellow-800">
                            Upload Required
                          </h3>
                          <p className="mt-1 text-sm text-yellow-600">
                            Please upload the signed document first
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <h3 className="font-medium">Update Document Status</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            className="border-green-500 text-green-600 hover:bg-green-50"
                            disabled={!uploadComplete || isSubmitting}
                            onClick={() => handleUpdateStatus("signed")}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                            disabled={isSubmitting}
                            onClick={() => handleUpdateStatus("rejected")}
                          >
                            <AlertCircle className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                        {isSubmitting && (
                          <p className="mt-2 text-center text-sm text-gray-500">
                            Updating document status...
                          </p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
