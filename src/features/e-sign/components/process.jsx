import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../../../lib/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../lib/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../lib/ui/tabs";
import { FileUp, FileDown, CheckCircle, AlertCircle } from "lucide-react";

export default function SignDocument() {
  const [activeTab, setActiveTab] = useState("download");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentStatus, setDocumentStatus] = useState("Pending");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejection_reason, setrejection_reason] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/admin/signature-list/${id}`
        );
        setDocument(response.data.data);
        setDocumentStatus(response.data.data.status);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!documentUrl) {
      setError("Please provide a document URL");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const payload = {
        uploaded_document_url: documentUrl,
        status: "Signed",
        rejection_reason: rejection_reason || "Document signed and approved",
      };

      // Add related IDs if they exist
      if (document?.citizen_id?._id) {
        payload.citizen_id = document.citizen_id._id;
      }
      if (document?.department_id?._id) {
        payload.department_id = document.department_id._id;
      }
      if (document?.service_id?._id) {
        payload.service_id = document.service_id._id;
      }

      console.log("Sending payload:", payload);

      const response = await axios.put(
        `http://localhost:5000/api/admin/signature/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Upload failed");
      }

      setIsUploading(false);
      setUploadComplete(true);
      setDocumentStatus("Signed");
      setActiveTab("status");
      setDocument(response.data.data);
    } catch (err) {
      setIsUploading(false);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to upload document"
      );
      console.error("Upload error:", err);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/signature/${id}`,
        {
          status: newStatus,
          description: rejection_reason || `Status changed to ${newStatus}`,
        }
      );

      setDocumentStatus(newStatus);
      setDocument(response.data.data);
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      setError(err.response?.data?.message || "Failed to update status");
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p>Loading document...</p>
      </div>
    );
  }

  if (error && !document) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Process Document</h2>
          <p className="text-gray-600">
            {document?.service_id?.name || "Untitled Document"} - Submitted by{" "}
            {document?.citizen_id?.email || "Unknown"}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Document Preview</CardTitle>
              </CardHeader>
              <CardContent className="relative min-h-[600px]">
                <div className="relative h-full w-full overflow-auto rounded border bg-white p-4">
                  {document?.uploaded_document_url ? (
                    <img
                      src={document.uploaded_document_url}
                      alt="Document Preview"
                      className="mx-auto block max-h-[580px]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      No document preview available
                    </div>
                  )}
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
                    <p>{document?.service_id?.name || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Citizen
                    </h3>
                    <p>{document?.citizen_id?.email || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Date Submitted
                    </h3>
                    <p>
                      {document?.uploaded_date
                        ? new Date(document.uploaded_date).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Department
                    </h3>
                    <p>{document?.department_id?.name || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Current Status
                    </h3>
                    <p className="capitalize">{document?.status || "N/A"}</p>
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
                          <li>Upload the scanned document or provide URL</li>
                        </ol>
                      </div>
                      <Button
                        variant="contained"
                        size="small"
                        component="a"
                        href={`http://localhost:5000/api/admin/esignature_download/${document._id}?download=true`}
                        download
                        sx={{
                          backgroundColor: "black",
                          "&:hover": { backgroundColor: "#333" },
                        }}
                      >
                        Download
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
                        disabled={
                          (!selectedFile && !documentUrl) || isUploading
                        }
                      >
                        {isUploading
                          ? "Processing..."
                          : "Submit Signed Document"}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="status">
                    <div className="space-y-4">
                      {uploadComplete ? (
                        <div className="rounded-lg bg-green-50 p-4 text-center">
                          <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
                          <h3 className="mt-2 font-medium text-green-800">
                            Document Submitted Successfully
                          </h3>
                          <p className="mt-1 text-sm text-green-600">
                            Current status:{" "}
                            <span className="font-medium capitalize">
                              {documentStatus}
                            </span>
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-lg bg-yellow-50 p-4 text-center">
                          <AlertCircle className="mx-auto h-8 w-8 text-yellow-500" />
                          <h3 className="mt-2 font-medium text-yellow-800">
                            Submission Required
                          </h3>
                          <p className="mt-1 text-sm text-yellow-600">
                            Please submit the signed document first
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <h3 className="font-medium">Update Document Status</h3>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Status Notes
                          </label>
                          <textarea
                            className="w-full rounded-md border p-2 text-sm"
                            rows={3}
                            value={rejection_reason}
                            onChange={(e) =>
                              setrejection_reason(e.target.value)
                            }
                            placeholder="Enter status update description"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            className="border-green-500 text-green-600 hover:bg-green-50"
                            onClick={handleUpload}
                            disabled={isUploading}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                            onClick={() => handleStatusUpdate("Rejected")}
                            disabled={isSubmitting}
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
