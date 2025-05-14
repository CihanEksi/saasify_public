import { withAuth } from '../../../lib/middleware/withAuth';
import { supabase } from '../../../lib/supabaseClient';
import { LINK_STATUS } from '../../../enums/link.enum';
import Joi from 'joi';
import { formatShortPath } from '~/lib/utils';

const linkSchema = Joi.object({
  long: Joi.string().uri().required(),
  short: Joi.string().required(),
  title: Joi.string().required(),
  status: Joi.string().valid(LINK_STATUS.active, LINK_STATUS.inactive).default(LINK_STATUS.active),
});

export const POST = withAuth((async ({ request, supabase, user }) => {
  console.log('POST request received', request.body);
  const body = await request.json();

  const { error: validationError } = linkSchema.validate(body);

  if (validationError) {
    return Response.json({ error: validationError.details }, { status: 400 });
  }

  const managedShort = formatShortPath(body.short);


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


  const { data, error } = await supabase
    .from('links')
    .insert([{
      long: body.long,
      short: managedShort,
      status: body.status,
      title: body.title,
      userid: user.id,
      created_at: new Date().toISOString(),
    }])
    .select();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    message: 'Link created successfully',
    data: data,
  }, { status: 201 });
}));

export const GET = withAuth((async ({ request, supabase, user }) => {
  const userid = user.id;
  const page = request.url.split('?')[1];
  const params = new URLSearchParams(page);
  const pageNumber = parseInt(params.get('page') || '1', 10);
  const pageSize = parseInt(params.get('limit') || '10', 10);
  const offset = (pageNumber - 1) * pageSize;
  const limit = pageSize;
  const keyword = params.get('keyword') || '';
  const search = keyword ? `%${keyword}%` : '%';
  const idParam = params.get('id');
  const shortParam = params.get('short');


  const supaCountRequest = supabase
    .from('links')
    .select('*', { count: 'exact', head: true })

  if (search) {
    supaCountRequest.ilike('title', search);
  }

  if (idParam) {
    supaCountRequest.eq('id', idParam);
  }

  if (shortParam) {
    supaCountRequest.eq('short', shortParam);
  }

  const { count, error: countError } = await supaCountRequest.eq('userid', userid);


  if (countError) {
    return Response.json({ error: countError.message }, { status: 500 });
  }

  const totalCount = count || 0;

  const supabaseRequest = supabase
    .from('links')
    .select('*')
    .eq('userid', userid)

  if (search) {
    supabaseRequest.ilike('title', search);
  }

  if (idParam) {
    supabaseRequest.eq('id', idParam);
  }

  if (shortParam) {
    supabaseRequest.eq('short', shortParam);
  }


  const { data: paginatedData, error: paginatedError } = await supabaseRequest
    .ilike('title', search)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (paginatedError) {
    return Response.json({ error: paginatedError.message }, { status: 500 });
  }
  return Response.json({
    message: 'Links retrieved successfully',
    data: paginatedData,
    totalCount: totalCount,
    page: pageNumber,
    pageSize: pageSize,
  }, { status: 200 });

}));