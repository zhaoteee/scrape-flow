import setupUser from "@/actions/billings/setupUser";

export default async function page() {
  return await setupUser();
}
