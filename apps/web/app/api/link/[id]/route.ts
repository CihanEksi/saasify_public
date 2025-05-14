import { withAuth } from '../../../../lib/middleware/withAuth';
import { formatShortPath } from '~/lib/utils';
import { LINK_STATUS } from '../../../../enums/link.enum';
import Joi from 'joi';
import { ILinkUpdatePayload } from '../../../../types/LinkTypes';

const updateLinkSchema = Joi.object({
    title: Joi.string().optional(),
    long: Joi.string().uri().optional(),
    short: Joi.string().optional(),
    status: Joi.string().valid(...Object.values(LINK_STATUS)).optional(),
});

export const PUT = withAuth((async ({ request, supabase, user, params }) => {
    const body = await request.json();
    const { id } = params;
    const { long, short, title, status } = body;

    const { error: validationError } = updateLinkSchema.validate(body);

    if (validationError) {
        return Response.json({ error: validationError.details }, { status: 400 });
    }

    const updateObject: ILinkUpdatePayload = {};

    if (long) {
        updateObject.long = long;
    }

    if (title) {
        updateObject.title = title;
    }
    if (status) {
        updateObject.status = status;
    }

    const { data: record, error: recordError } = await supabase
        .from('links')
        .select('*')
        .eq('id', id)
        .eq('userid', user.id)
        .single();

    if (recordError) {
        return Response.json({ error: "Error fetching link" }, { status: 500 });
    }

    if (short) {
        const managedShort = formatShortPath(short);
        if (managedShort === record.short) {
            updateObject.short = managedShort;
        } else {
            const { data: existingLink, error: findError } = await supabase
                .from('links')
                .select('short')
                .eq('short', managedShort)

            if (findError) {
                return Response.json({ error: "Error checking for existing link" }, { status: 500 });
            }
            if (existingLink.length > 0) {
                return Response.json({ error: 'Short link already exists' }, { status: 400 });
            }
            updateObject.short = managedShort;
        }

    }

    if (Object.keys(updateObject).length === 0) {
        return Response.json({ error: 'No fields to update' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('links')
        .update(updateObject)
        .eq('userid', user.id)
        .eq('id', id)
        .select();

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
        message: 'Link updated successfully',
        data: data,
    }, { status: 200 });
}
));

export const DELETE = withAuth((async ({ request, supabase, user, params }) => {
    const { id } = params;

    if (!id) {
        return Response.json({ error: 'ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('links')
        .delete()
        .eq('id', id)
        .eq('userid', user.id)
        .select();

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
        message: 'Link deleted successfully',
        data: data,
    }, { status: 200 });
}));