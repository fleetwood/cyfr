import { GetSessionParams } from "next-auth/react";
import AdminLayout from "../components/layouts/AdminLayout";
import { CyfrLogo } from "../components/ui/icons";
import { useSession } from "../lib/next-auth-react-query";
import { PrismaGenre, PrismaUser } from "../prisma/prismaContext";
import { canAccess, GenreList } from "../prisma/types";
import { useState } from "react";
import useDebug from "../hooks/useDebug";
import GenreAdmin from "../components/containers/Genre/GenreAdmin";
import { uniqueKey } from "../utils/helpers";
import { InferGetServerSidePropsType } from "next";
import Link from "next/link";

const { debug } = useDebug("admin page", "DEBUG");

export async function getServerSideProps(
  context: GetSessionParams | undefined
) {
  const cyfrUser = await PrismaUser.userInSessionContext(context);
  const allow = canAccess({
    required: "owner",
    cyfrUser: cyfrUser || undefined,
  })
  const genres = await PrismaGenre.list()
  return { props: { allow, genres } };
}

type AdminPageProps = {
  allow: boolean;
  genres: GenreList[]
};

const AdminPage = ({allow, genres}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useSession({ required: true, redirectTo: "/" })
  const [editGenre, setEditGenre] = useState<GenreList|null>(null)
  
  const CyfrHome = (
    <div className="flex">
      <CyfrLogo className="animate-pulse text-primary w-[3.75rem] mt-2" />
      <div>Cyfr Admin</div>
    </div>
  );
  return (
    allow && (
      <AdminLayout sectionTitle={CyfrHome}>
        <div>
          <Link href="/"><h2 className="h-subtitle">Home</h2></Link>
        </div>
        <div>
          <h2 className="h-title">Dashboard</h2>
        </div>
        <div>
          <h2 className="h-subtitle">Genres</h2>
          <div className="flex flex-wrap justify-items-center">
            {genres?.map(genre => 
              <div key={uniqueKey(genre)} className='btn btn-primary text-primary-content rounded-md px-2 mr-2 mb-2 sm:w-1/3 md:w-1/6' onClick={() => setEditGenre(genre)}>
                {genre.title}
              </div>)}
          </div>
          <GenreAdmin editGenre={editGenre} />
        </div>
      </AdminLayout>
    )
  );
};

export default AdminPage;
