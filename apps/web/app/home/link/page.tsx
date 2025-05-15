"use client"
import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, Copy, Loader2, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PageHeader } from "@kit/ui/page"
import Link from "next/link"
import { useLink } from "@/hooks/useLink"
import { ILink } from "@/types/LinkTypes"
import useDebounce from "@/hooks/useDebounce"
import LinkTableHeader from "./_components/LinkTableHeader"
import LinkDropdownMenu from "./_components/LinkDropdownMenu"
import LinkTable from "./_components/LinkTable"
import LinkTablePaginationElements from "./_components/LinkTablePaginationElements"

function LinkPage() {
  const { getQuery, deleteMutation } = useLink();
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pageIndex, setPageIndex] = React.useState(0);
  const pageSize = 10;
  const [inputKeyword, setInputKeyword] = React.useState('');
  const keyword = useDebounce(inputKeyword, 500); // 500ms debounce delay

  const { data: linkData, isLoading, refetch } = getQuery({
    page: pageIndex + 1,
    limit: pageSize,
    keyword: keyword,
  })

  const totalCount = linkData?.totalCount || 0
  const [pageCount, setPageCount] = React.useState(0)

  React.useEffect(() => {
    if (totalCount) {
      const totalPages = Math.ceil(totalCount / pageSize);
      setPageCount(totalPages);
    }
  }, [totalCount, pageSize]);


  const handleDeleteLink = (id: string) => {
    toast.promise(
      new Promise((resolve, reject) => {
        toast(
          "Are you sure you want to delete this link?",
          {
            action: {
              label: "Confirm",
              onClick: () => {
                deleteMutation.mutate(id, {
                  onSuccess: () => {
                    resolve("Link deleted successfully");
                    table.resetRowSelection();
                    refetch();
                  },
                  onError: (error) => {
                    reject(error);
                  }
                });
              },
            },
            cancel: {
              label: "Cancel",
              onClick: () => {
                reject("Deletion canceled");
              },
            },
            duration: 2000,
          }
        );
      }),
      {
        success: "Link deleted successfully!",
        error: (err) => `Process failed`,
      }
    );
  };

  const columns: ColumnDef<ILink>[] = [
    {
      accessorKey: "id",
      header: () => <div className="text-right">ID</div>,
      cell: ({ row }) => {
        return <div className="text-right font-medium">{row.getValue("id")}</div>
      },
    },
    {
      accessorKey: "title",
      header: () => <div className="text-left">Title</div>,
      cell: ({ row }) => {
        return <div className="text-left font-medium">{row.getValue("title")}</div>
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-left">Status</div>,
      cell: ({ row }) => (
        <div className={`flex items-center ${row.getValue("status") === "active" ? "text-green-600" : "text-red-600"}`}>
          {row.getValue("status")}
        </div>
      ),
    },
    {
      accessorKey: "long",
      header: ({ column }) => <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="max-w-[150px] overflow-hidden text-ellipsis"
      >
        Long
        <ArrowUpDown />
      </Button>,
      cell: ({ row }) => {
        return <Link
          href={`${row.getValue("long")}`}
          className="text-left font-medium text-blue-500 hover:text-blue-700 truncate block max-w-[240px] overflow-hidden"
          title={`${row.getValue("long")}`}
        >
          {row.getValue("long")}
        </Link>
      },
    },
    {
      accessorKey: "short",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Short
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) =>
        <div
          className="flex items-center"
        >
          <Link
            href={`/go/${row.getValue("short")}`}
            className="text-left font-medium text-blue-500 hover:text-blue-700"
          >
            <div className="text-left font-medium">
              {row.getValue("short")}
            </div>
          </Link>

          <div className="ml-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const siteUrl = window.location.origin
                const shortLink = row.getValue("short")
                const fullLink = `${siteUrl}/go${shortLink}`
                navigator.clipboard.writeText(fullLink).then(() => {
                  toast.success(`Link Copied`, {
                    description: `${fullLink} Link Copied`,
                    duration: 3000
                  })
                })
              }
              }
            >
              <Copy />
            </Button>
          </div>
        </div>,
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => <div className="text-left">Actions</div>,
      cell: ({ row }) => {
        const payment = row.original
        const rowStatus = row.getValue("status")
        const isActive = rowStatus === "active"

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 font-bold"
                onClick={() => {
                  handleDeleteLink(payment.id)
                }
                }
                disabled={deleteMutation.loading}
              >
                {deleteMutation.loading && payment.id === deleteMutation.data?.id ?
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Delete Link!
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={`/home/link/manage?id=${payment.id}`}
                  className="flex items-center"
                >
                  Edit Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: linkData?.data || [],
    columns,
    pageCount: pageCount,
    manualPagination: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      const newState = typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(newState.pageIndex);
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize: pageSize,
      },
    },
  })

  return (
    <>
      <PageHeader description={'Analytics, branding, and control over every link.'} />

      <div className="w-full px-4">
        <div className="flex items-center py-4">
          <LinkTableHeader inputKeyword={inputKeyword} setInputKeyword={setInputKeyword} />
          <LinkDropdownMenu table={table} />
        </div>

        <div className="rounded-md border">
          <LinkTable
            columns={columns}
            isLoading={isLoading}
            table={table}
          />
        </div>

        <LinkTablePaginationElements
          table={table}
        />
      </div>
    </>
  )
}

export default LinkPage