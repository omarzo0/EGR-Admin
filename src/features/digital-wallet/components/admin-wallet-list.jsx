"use client";

import { useState } from "react";
import { Eye, MoreHorizontal, UserCheck, UserX, Trash2 } from "lucide-react";
import { Button } from "../../../lib/ui/button";
import { Link } from "react-router-dom";

export function AdminWalletList({ wallets }) {
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleActionMenu = (walletId) => {
    if (actionMenuOpen === walletId) {
      setActionMenuOpen(null);
    } else {
      setActionMenuOpen(walletId);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
              User
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
              Wallet ID
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
              Created
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
              Documents
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
              Status
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {wallets.map((wallet) => (
            <tr key={wallet.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-3">
                    {wallet.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{wallet.userName}</p>
                    <p className="text-sm text-gray-500">{wallet.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-sm">{wallet.id}</td>
              <td className="px-4 py-4 text-sm">
                {formatDate(wallet.dateCreated)}
              </td>
              <td className="px-4 py-4 text-sm">{wallet.documentsCount}</td>
              <td className="px-4 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    wallet.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {wallet.status === "active" ? "Active" : "Suspended"}
                </span>
              </td>
              <td className="px-4 py-4 text-right">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleActionMenu(wallet.id)}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>

                  {actionMenuOpen === wallet.id && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                      >
                        <Link
                          to={`/app/wallet`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Eye className="mr-3 h-4 w-4" />
                          View Details
                        </Link>

                        {wallet.status === "active" ? (
                          <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <UserX className="mr-3 h-4 w-4" />
                            Suspend Wallet
                          </button>
                        ) : (
                          <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <UserCheck className="mr-3 h-4 w-4" />
                            Activate Wallet
                          </button>
                        )}

                        <button className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                          <Trash2 className="mr-3 h-4 w-4" />
                          Delete Wallet
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
