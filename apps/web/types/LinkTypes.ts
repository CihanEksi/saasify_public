export type ILinkUpdatePayload = {
    long?: string;
    short?: string;
    title?: string;
    status?: string;
}

export type ILink = {
    id: string;
    short: string;
    long: string;
    status: string;
    title: string;
    created_at: string;
}


export type ILinkCreatePayload = Pick<ILink, 'long' | 'short' | 'title' | 'status'>; 