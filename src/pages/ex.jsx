//Profile.tsx

​import { useState, useRef } from "react";
import { useUploadAvatar } from "./hooks/useUploadAvatar";
import { useFetchAvatar, setAvatarCache, refreshAvatar } from "./hooks/useFetchAvatar";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Group,
  Loader,
  Paper,
  PasswordInput,
  Progress,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
  ThemeIcon,
} from "@mantine/core";
import {
  IconInfoCircle,
  IconX,
  IconCheck,
  IconMail,
  IconLock,
  IconUpload,
} from "@tabler/icons-react";
import { useMyProfile } from "./hooks/useMyProfile";
import { useGetOrganizationsWithUsers } from "../organizations/hooks/useGetOrganizationsWithUsers";
import { UserRole } from "../../store/userRole";
import {
  passwordValidation,
  passwordPolicy,
} from "../../helpers/passwordValidation";
import { usePasswordReset } from "../forgot-password/hooks/useResetPassword";
import { useUpdateUsername } from "./hooks/useUpdateUsername";

const roleDisplayMap: Record<string, string> = {
  "Super Admin": "Super Admin",
  "Master Admin": "Administrator",
  "Unit Admin": "Customer",
  "Normal Admin": "General User",
  MasterAdmin: "Administrator",
  UnitAdmin: "Customer",
  NormalAdmin: "General User",
  SuperAdmin: "Super Admin",
};

function getInitials(value?: string): string {
  if (!value) return "U";
  const words = value.split(/[._\- ]+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return value.substring(0, 2).toUpperCase();
}

function formatDisplayName(userName?: string, email?: string): string {
  if (userName) return userName;
  if (email) {
    const namePart = email.split("@")[0];
  return namePart
      .split(/[._-]/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  return "User";
}

function formatRole(role?: UserRole | null): string {
  if (!role) return "—";
  return roleDisplayMap[role] ?? (role as string);
}

interface FieldRowProps {
  label: string;
  children: React.ReactNode;
}

function FieldRow({ label, children }: FieldRowProps) {
  return (
    <Group align="flex-start" wrap="nowrap" gap="md" w="100%">
      <Text
        size="sm"
        fw={500}
        c="dark.6"
        w={160}
        style={{ flexShrink: 0, paddingTop: 6 }}
      >
        {label}
      </Text>
      <Box style={{ flex: 1, minWidth: 0 }}>{children}</Box>
    </Group>
  );
}

const readonlyInputStyles = {
  root: { width: "100%" },
  input: { backgroundColor: "white", cursor: "default", color: "#495057" },
};

const editableInputStyles = {
  root: { width: "100%" },
  input: { backgroundColor: "white" },
};

type ProfileData = NonNullable<ReturnType<typeof useMyProfile>["profile"]>;

interface AvatarUploaderProps {
  initials: string;
}

const ACCEPTED_FORMATS = ["image/jpeg", "image/jpg", "image/png"];

function AvatarUploader({ initials }: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { avatarUrl } = useFetchAvatar();
  const { uploading, uploadError, uploadSuccess, uploadAvatar, clearUploadStatus } =
    useUploadAvatar();
  const [formatError, setFormatError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      setFormatError("Invalid file type. Please upload a JPG, JPEG, or PNG image.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFormatError("");
    clearUploadStatus();
    const localUrl = URL.createObjectURL(file);
    setAvatarCache(localUrl);

    try {
      await uploadAvatar(file);
      await refreshAvatar();
    } catch {
      setAvatarCache(null);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Group align="center" gap="md">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <Box className="avatar" style={{ position: "relative", display: "inline-flex" }}>
        <Avatar
          size={64}
          radius="xl"
          color="#0A5488"
          variant="filled"
          src={avatarUrl ?? undefined}
        >
          {!avatarUrl && (
            <Text fw={700} size="lg" c="white">
              {initials}
            </Text>
          )}
        </Avatar>
      </Box>

      <Box>
        <Text size="sm" fw={600} c="dark.7">
          Profile Picture
        </Text>
        <Text size="xs" c="dimmed">
          {uploading ? (
            "Uploading…"
          ) : (
            <>
              Only{" "}
              {(["JPG", "JPEG", "PNG"] as const).map((ext) => (
                <Text
                  key={ext}
                  component="span"
                  fw={700}
                  style={{
                    backgroundColor: "#DBEAFE",
                    color: "#1D4ED8",
                    padding: "1px 5px",
                    borderRadius: 4,
                    fontSize: 10,
                    letterSpacing: "0.04em",
                    marginLeft: 3,
                    display: "inline-block",
                  }}
                >
                  {ext}
                </Text>
              ))}{" "}
              <Text component="span" size="xs" c="dimmed">
                images can be uploaded
              </Text>
            </>
          )}
        </Text>

        {uploadSuccess && (
          <Group gap={4} mt={4}>
            <IconCheck size={12} color="teal" />
            <Text size="xs" c="teal">
              Profile picture updated!
            </Text>
          </Group>
        )}

        {(formatError || uploadError) && (
          <Group gap={4} mt={4}>
            <IconX size={12} color="red" />
            <Text size="xs" c="red">
              {formatError || uploadError}
            </Text>
          </Group>
        )}

        <Button
          size="xs"
          variant="subtle"
          color="#0A5488"
          mt={4}
          leftSection={<IconUpload size={12} />}
          loading={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          Upload photo
        </Button>
      </Box>
    </Group>
  );
}

interface GeneralTabProps {
  profile?: ProfileData;
  organizationName: string;
}

function GeneralTab({ profile, organizationName }: GeneralTabProps) {
  const displayName = formatDisplayName(profile?.userName, profile?.email);
  const initials = getInitials(profile?.userName ?? profile?.email);

  const joinedAt = profile?.createdAt
    ? (() => {
        const date = new Date(profile.createdAt);
        return isNaN(date.getTime())
          ? "N/A"
          : date.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
      })()
    : "N/A";

  return (
    <Stack gap="lg" w="100%">
      <Box>
        <Text fw={700} size="sm" c="dark.7">
          Profile Information
        </Text>
        <Text size="xs" c="dimmed">
          Update your basic information and preferences
        </Text>
      </Box>

      <AvatarUploader initials={initials} />

      <Stack gap="sm" w="45%">
        <FieldRow label="UserName">
          <TextInput
            placeholder="Current Username"
            value={displayName}
            readOnly
            styles={readonlyInputStyles}
          />
        </FieldRow>

        <FieldRow label="Email">
          <TextInput
            placeholder="Email"
            value={profile?.email ?? ""}
            readOnly
            styles={readonlyInputStyles}
          />
        </FieldRow>

        <FieldRow label="Organization Name">
          <TextInput
            placeholder="Active Organization Name"
            value={organizationName}
            readOnly
            styles={readonlyInputStyles}
          />
        </FieldRow>

        <FieldRow label="Role">
          <TextInput
            placeholder="Your Role"
            value={formatRole(profile?.role)}
            readOnly
            styles={readonlyInputStyles}
          />
        </FieldRow>

        <FieldRow label="Joined At">
          <TextInput
            placeholder="Joined At Date"
            value={joinedAt}
            readOnly
            styles={readonlyInputStyles}
          />
        </FieldRow>
      </Stack>
    </Stack>
  );
}

function UsernameTab({ profile }: { profile?: ProfileData }) {
  const currentDisplayName = formatDisplayName(
    profile?.userName,
    profile?.email,
  );
  const [newUsername, setNewUsername] = useState("");

  const { editUsername, loading } = useUpdateUsername(() => {
    setNewUsername("");
  });

  const handleUpdate = () => {
    if (!newUsername.trim()) return;
    editUsername(newUsername.trim());
  };

  return (
    <Stack gap="lg" w="45%">
      <Box>
        <Text fw={700} size="sm" c="dark.7">
          Change Username
        </Text>
        <Text size="xs" c="dimmed">
          Update your unique username for your account.
        </Text>
      </Box>

      <Stack gap="sm" w="100%">
        <FieldRow label="UserName">
          <TextInput
            placeholder="Current Username"
            value={currentDisplayName}
            readOnly
            styles={readonlyInputStyles}
          />
        </FieldRow>

        <FieldRow label="New UserName">
          <TextInput
            placeholder="New Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.currentTarget.value)}
            styles={editableInputStyles}
          />
        </FieldRow>

        <FieldRow label="">
          <Button
            color="indigo"
            onClick={handleUpdate}
            loading={loading}
            loaderProps={{ type: "dots" }}
            disabled={!newUsername.trim() || loading}
          >
            Update
          </Button>
        </FieldRow>
      </Stack>
    </Stack>
  );
}

interface PasswordStrengthProps {
  password: string;
  confirmPassword: string;
}

function PasswordStrengthIndicator({
  password,
  confirmPassword,
}: PasswordStrengthProps) {
  if (!password) return null;

  const evaluation = passwordValidation(password, confirmPassword);

  return (
    <Stack gap="xs" mt="xs">
      <Group gap="xs" align="center">
        <Progress
          value={evaluation.strength}
          color={evaluation.color}
          size="sm"
          style={{ flex: 1 }}
        />
        <Text size="xs" fw={600} c={evaluation.color} w={40}>
          {evaluation.label}
        </Text>
      </Group>

      <Stack gap={4}>
        {evaluation.checks.map((check) => (
          <Group key={check.label} gap="xs" align="center">
            <ThemeIcon
              size={16}
              radius="xl"
              color={check.met ? "teal" : "gray"}
              variant="filled"
            >
              {check.met ? <IconCheck size={10} /> : <IconX size={10} />}
            </ThemeIcon>
            <Text size="xs" c={check.met ? "teal" : "dimmed"}>
              {check.label}
            </Text>
          </Group>
        ))}

        <Group gap="xs" align="center">
          <ThemeIcon
            size={16}
            radius="xl"
            color={password.length >= 8 ? "teal" : "gray"}
            variant="filled"
          >
            {password.length >= 8 ? (
              <IconCheck size={10} />
            ) : (
              <IconX size={10} />
            )}
          </ThemeIcon>
          <Text size="xs" c={password.length >= 8 ? "teal" : "dimmed"}>
            At least 8 characters
          </Text>
        </Group>
      </Stack>
    </Stack>
  );
}

interface SecurityTabProps {
  email: string;
}

function SecurityTab({ email }: SecurityTabProps) {
  const [emailInput, setEmailInput] = useState(email);
  const [emailError, setEmailError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const {
    isEmailVerified,
    isVerifying,
    isResetting,
    emailVerifyError,
    setEmailVerifyError,
    verifyEmail,
    handleResetPassword,
  } = usePasswordReset();

  const passwordRegex =
    /^(?=(.*[A-Z]){1})(?=(.*[a-z]){1})(?=(.*[0-9]){1})(?=(.*[@#$%^!&+=.\-_*]){1})([a-zA-Z0-9@#$%^!&+=*.\-_]){8,}$/;

  const validateEmail = (value: string) => {
    if (!value) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email.";
    return "";
  };

  const validateNewPassword = (value: string) => {
    if (!value) return "Password is required.";
    if (!passwordRegex.test(value)) return passwordPolicy;
    return "";
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) return "Confirm password is required.";
    if (value !== newPassword) return "Passwords don't match.";
    return "";
  };

  const handleVerifyEmail = async () => {
    const error = validateEmail(emailInput);
    setEmailError(error);
    if (error) return;
    try {
      await verifyEmail(emailInput);
    } catch (err) {
      console.log(err);
    }
  };

  const handleResetPasswordClick = async () => {
    const pwdError = validateNewPassword(newPassword);
    const confirmError = validateConfirmPassword(confirmPassword);
    setNewPasswordError(pwdError);
    setConfirmPasswordError(confirmError);
    if (pwdError || confirmError) return;
    try {
      await handleResetPassword(newPassword, confirmPassword);
      setResetSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Stack gap="lg" w="100%">
      <Box>
        <Text fw={700} size="sm" c="dark.7">
          Change Password
        </Text>
        <Text size="xs" c="dimmed">
          Update your password to keep your account secure.
        </Text>
      </Box>

      {resetSuccess && (
        <Alert
          icon={<IconCheck size={16} />}
          color="teal"
          title="Password updated"
          withCloseButton
          onClose={() => setResetSuccess(false)}
          w="45%"
        >
          Your password has been changed successfully.
        </Alert>
      )}

      <Stack gap="sm" w="45%">
        <FieldRow label="Email">
          <TextInput
            type="email"
            value={emailInput}
            onChange={(e) => {
              setEmailInput(e.currentTarget.value);
              setEmailError(validateEmail(e.currentTarget.value));
              if (emailVerifyError) setEmailVerifyError("");
            }}
            placeholder="name@company.com"
            size="md"
            disabled={isEmailVerified}
            error={emailError || emailVerifyError}
            leftSection={<IconMail size={18} color="#9ca3af" />}
            styles={{
              input: {
                borderRadius: "8px",
                border: isEmailVerified
                  ? "1px solid #e5e7eb"
                  : "1px solid #344C9E",
                backgroundColor: "#fff",
              },
            }}
          />
        </FieldRow>

        <FieldRow label="">
          <Button
            fullWidth
            size="md"
            loading={isVerifying}
            loaderProps={{ type: "dots" }}
            disabled={
              !emailInput ||
              isEmailVerified ||
              !!emailError ||
              !!emailVerifyError
            }
            onClick={handleVerifyEmail}
            style={{
              background: "#0A5488",
              borderRadius: "8px",
              color: "#fff",
              fontWeight: 500,
              height: "42px",
            }}
            styles={{ root: { "&:hover": { background: "#0A5488" } } }}
          >
            Send Reset Link
          </Button>
        </FieldRow>
      </Stack>

      {isEmailVerified && (
        <>
          <Alert
            icon={<IconCheck size={16} />}
            color="teal"
            variant="light"
            w="45%"
          >
            Email verified — enter your new password below.
          </Alert>

          <Stack gap="sm" w="45%">
            <FieldRow label="New Password">
              <Box w="100%">
                <PasswordInput
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.currentTarget.value);
                    setNewPasswordError(
                      validateNewPassword(e.currentTarget.value),
                    );
                  }}
                  size="md"
                  error={newPasswordError}
                  leftSection={<IconLock size={18} color="#9ca3af" />}
                  styles={{
                    input: {
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      backgroundColor: "#fff",
                    },
                  }}
                />
                <PasswordStrengthIndicator
                  password={newPassword}
                  confirmPassword={confirmPassword}
                />
              </Box>
            </FieldRow>

            <FieldRow label="Confirm Password">
              <PasswordInput
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.currentTarget.value);
                  setConfirmPasswordError(
                    validateConfirmPassword(e.currentTarget.value),
                  );
                }}
                size="md"
                error={confirmPasswordError}
                leftSection={<IconLock size={18} color="#9ca3af" />}
                styles={{
                  input: {
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#fff",
                  },
                }}
              />
            </FieldRow>

            <FieldRow label="">
              <Button
                color="indigo"
                size="md"
                loading={isResetting}
                loaderProps={{ type: "dots" }}
                disabled={
                  isResetting ||
                  !newPassword ||
                  !confirmPassword ||
                  !!newPasswordError ||
                  !!confirmPasswordError
                }
                onClick={handleResetPasswordClick}
                style={{ borderRadius: "8px", fontWeight: 500 }}
              >
                Change Password
              </Button>
            </FieldRow>
          </Stack>
        </>
      )}
    </Stack>
  );
}

export function Profile() {
  const { profile, loading, error } = useMyProfile();
  const { organizations } = useGetOrganizationsWithUsers();
  const [activeTab, setActiveTab] = useState<string | null>("general");

  const organizationName =
    organizations.find(
      (org) => org.organizationId === profile?.activeOrganizationId,
    )?.organizationName ?? "—";

  return (
    <Box p="xl" bg="gray.1" mih="100vh" w="100%">
      <Box mb="lg">
        <Title order={2} fw={700} c="dark.8">
          My Profile
        </Title>
        <Text size="sm" c="dimmed">
          Manage your account settings and preferences
        </Text>
      </Box>

      {loading && (
        <Group justify="center" mt="xl">
          <Loader size="md" color="indigo" />
        </Group>
      )}

      {error && (
        <Alert
          icon={<IconInfoCircle size={16} />}
          color="red"
          title="Failed to load profile"
          mb="md"
          w="100%"
        >
          {error.message}
        </Alert>
      )}

      {!loading && (
        <Tabs
          value={activeTab}
          onChange={setActiveTab}
          variant="pills"
          w="100%"
        >
          <Paper
            radius="md"
            p={4}
            mb="md"
            w="100%"
            style={{ backgroundColor: "#D9D9D9", border: "none" }}
          >
            <Tabs.List
              grow
              style={{ flexWrap: "nowrap", gap: 0, background: "transparent" }}
            >
              {(
                [
                  { value: "general", label: "General" },
                  { value: "username", label: "Username" },
                  { value: "security", label: "Security" },
                ] as const
              ).map(({ value, label }) => {
                const isActive = activeTab === value;
                return (
                  <Tabs.Tab
                    key={value}
                    value={value}
                    px="xl"
                    py="xs"
                    style={{
                      borderRadius: "6px",
                      fontWeight: isActive ? 700 : 400,
                      color: isActive ? "#1a1a1a" : "#555",
                      backgroundColor: isActive ? "white" : "transparent",
                      boxShadow: isActive
                        ? "0 1px 4px rgba(0,0,0,0.15)"
                        : "none",
                      border: "none",
                      transition: "all 0.15s ease",
                      flex: 1,
                      textAlign: "center",
                    }}
                  >
                    {label}
                  </Tabs.Tab>
                );
              })}
            </Tabs.List>
          </Paper>

          <Paper
            withBorder
            radius="xl"
            p="xl"
            w="100%"
            style={{ backgroundColor: "#e8e8e8", borderColor: "#dee2e6" }}
          >
            <Tabs.Panel value="general">
              <GeneralTab
                profile={profile}
                organizationName={organizationName}
              />
            </Tabs.Panel>

            <Tabs.Panel value="username">
              <UsernameTab profile={profile} />
            </Tabs.Panel>

            <Tabs.Panel value="security">
              <SecurityTab email={profile?.email ?? ""} />
            </Tabs.Panel>
          </Paper>
        </Tabs>
      )}
    </Box>
  );
}
