import React from 'react'
import Link from 'next/link'
import { Button } from '@kit/ui/button'
import { Input } from '@kit/ui/input'
import { Plus } from 'lucide-react'

function LinkTableHeader(
    props: {
        inputKeyword: string
        setInputKeyword: (keyword: string) => void
    }
) {
    const { inputKeyword, setInputKeyword } = props
    return (
        <div
            className="flex justify-between items-center w-full"
        >
            <Input
                placeholder="Filter by Title.."
                value={inputKeyword}
                onChange={(event) => setInputKeyword(event.target.value)}
                className="max-w-sm"
            />

            <Link href={'/home/link/manage'}>
                <Button
                    className="ml-2"
                    variant="outline"
                    size="lg"
                >
                    <Plus /> New Link
                </Button>
            </Link>
        </div>
    )
}

export default LinkTableHeader