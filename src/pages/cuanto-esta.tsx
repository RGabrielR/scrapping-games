import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return { redirect: { destination: "/como-voto", permanent: false } };
};

export default function CuantoEsta() {
  return null;
}
