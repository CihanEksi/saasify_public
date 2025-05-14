import { useMutation } from '@tanstack/react-query';
import { ILinkCreatePayload, ILinkUpdatePayload } from '../types/LinkTypes';

const createLinkRequest = async (linkData: ILinkCreatePayload) => {
    const res = await fetch('/api/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(linkData),
        credentials: 'include',
    });

    if (!res.ok) {
        const errorData = await res.json();

        if (errorData.error) {
            throw new Error(errorData.error);
        }

        throw new Error(errorData.message || "Could not create link");
    }

    return res.json();
}

const updateLinkRequest = async ({ id, data }: { id: string, data: ILinkUpdatePayload }) => {
    const res = await fetch(`/api/link/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Could not update link");
    }

    return res.json();
}

const deleteLinkRequest = async (id: string) => {
    const res = await fetch(`/api/link/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error("Could not delete link");
    }

    return res.json();
}

const getLinkRequest = async ({ page, limit, keyword, id }: { id: string | undefined, page: number, limit: number, keyword: string }) => {
    let query = "?"

    if (id) {
        query += `id=${id}&`;
    }
    if (page) {
        query += `page=${page}&`;
    }
    if (limit) {
        query += `limit=${limit}&`;
    }
    if (keyword) {
        query += `keyword=${keyword}&`;
    }

    query = query.slice(0, -1)
    
    const res = await fetch(`/api/link${query}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Could not fetch links");
    }

    return res.json();
}




export const useLink = () => {
    const createLink = useMutation({
        mutationFn: createLinkRequest,
        onSuccess: (data) => {
        }
    })

    const updateLink = useMutation({
        mutationFn: updateLinkRequest,
        onSuccess: (data) => {
        }
    })

    const deleteLink = useMutation({
        mutationFn: deleteLinkRequest,
        onSuccess: (data) => {
        }
    })

    const getLink = useMutation({
        mutationFn: getLinkRequest,
        onSuccess: (data) => {
        }
    })

    return {
        createMutation: {
            loading: createLink.isPending,
            data: createLink.data,
            errorMessage: createLink.error?.message,
            mutate: createLink.mutate,
        },
        updateMutation: {
            loading: updateLink.isPending,
            data: updateLink.data,
            errorMessage: updateLink.error?.message,
            mutate: updateLink.mutate,
        },
        deleteMutation: {
            loading: deleteLink.isPending,
            data: deleteLink.data,
            errorMessage: deleteLink.error?.message,
            mutate: deleteLink.mutate,
        },
        getQuery: {
            loading: getLink.isPending,
            data: getLink.data,
            errorMessage: getLink.error?.message,
            mutate: getLink.mutate,
        },
    }
}
