"use client";
import AuthLayout from "../../components/layouts/AuthLayout";
import { ProfilePage } from "../../components/pages/ProfilePage";

export default function Profile() {
  return (
    <>
      <AuthLayout>
        <ProfilePage />
      </AuthLayout>
    </>
  );
}
