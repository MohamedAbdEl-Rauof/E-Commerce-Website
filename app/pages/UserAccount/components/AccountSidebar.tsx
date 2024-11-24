"use client";

import {
  Avatar,
  Card,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  FaUser,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaHeart,
  FaSignOutAlt,
  FaPencilAlt,
} from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {signOut, useSession} from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface UserData {
  name: string;
}

const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>(({ theme, active }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(0.5),
  backgroundColor: active ? "white" : "transparent",
  boxShadow: active ? theme.shadows[1] : "none",
  "&:hover": {
    backgroundColor: active ? "white" : "rgba(255, 255, 255, 0.5)",
  },
}));

const menuItems = [
  { label: "Account", icon: FaUser, href: "/pages/UserAccount" },
  {
    label: "Address",
    icon: FaMapMarkerAlt,
    href: "/pages/UserAccount/address",
  },
  { label: "Orders", icon: FaShoppingBag, href: "/pages/UserAccount/orders" },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/users?id=${userId}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  // Get avatar image from localStorage on mount
  const [avatarSrc, setAvatarSrc] = useState(() => {
    // Retrieve stored image from localStorage (if available)
    const savedAvatar = localStorage.getItem("avatar");
    return savedAvatar ? savedAvatar : "";
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleIconClick = () => {
    // Trigger the file input dialog
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Update the avatar image with the selected file
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const base64Image = fileReader.result as string;
        setAvatarSrc(base64Image); // Update avatar state
        localStorage.setItem("avatar", base64Image); // Store image in localStorage
      };
      fileReader.readAsDataURL(file); // Convert file to Base64
    }
  };
  const handleLogout = async () => {
    await signOut({ redirect: false });
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Logged Out Done",
      showConfirmButton: false,
      timer: 1500,
    });
    router.push("/pages/Home");
  };


  return (
    <Card sx={{ p: 3, bgcolor: "grey.50", border: 0 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Avatar src={avatarSrc} alt="Avatar" sx={{ width: 96, height: 96 }} />
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              bgcolor: "white",
              boxShadow: 2,
              "&:hover": { bgcolor: "white" },
            }}
            onClick={handleIconClick}
          >
            <FaPencilAlt size={14} />
          </IconButton>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </Box>
        <Typography variant="h6" sx={{ mt: 2 }}>
          {userData ? userData.name : "Loading..."}
        </Typography>
      </Box>

      <List sx={{ p: 0 }}>
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <StyledListItem active={pathname === item.href}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <item.icon size={20} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </StyledListItem>
          </Link>
        ))}

        <Button
          startIcon={<FaSignOutAlt />}
          color="error"
          fullWidth
          onClick={handleLogout}
          sx={{
            justifyContent: "flex-start",
            pl: 2,
            mt: 1,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Log Out
        </Button>
      </List>
    </Card>
  );
}
