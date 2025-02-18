import NextAuth from 'next-auth';
import { options } from './options';
// import { forceRefreshQuery } from '@/constants';

const handler = async (req: any, res: any) => {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  // console.log(searchParams , "searchParams");
  // const query = searchParams.get(forceRefreshQuery);
  if (url) return await NextAuth(req, res, options(searchParams ? searchParams : undefined));
};

export { handler as GET, handler as POST };
