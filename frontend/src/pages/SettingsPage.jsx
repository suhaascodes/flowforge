import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiSave, FiTrash2 } from 'react-icons/fi';
import { userAPI } from '../api';
import { useAuth } from '../context/AuthContext';

function emptyCreateUserForm() {
  return {
    name: '',
    email: '',
    password: '',
    role: 'member',
  };
}

export default function SettingsPage() {
  const { user, refreshSession } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [profileForm, setProfileForm] = useState({ name: '', email: '', password: '' });
  const [createUserForm, setCreateUserForm] = useState(emptyCreateUserForm);
  const [users, setUsers] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingUserId, setSavingUserId] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setProfileForm((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        password: '',
      }));
    }
  }, [user]);

  const loadUsers = useCallback(async () => {
    if (!isAdmin) {
      return;
    }

    try {
      setLoadingUsers(true);
      const response = await userAPI.getAll({ limit: 100, sortOrder: 'desc' });
      setUsers(response?.data?.data || []);
    } catch (loadError) {
      setError(loadError?.response?.data?.message || 'Unable to load users.');
    } finally {
      setLoadingUsers(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const canSaveProfile = useMemo(() => {
    if (!user) {
      return false;
    }

    return (
      profileForm.name.trim() &&
      profileForm.email.trim() &&
      (
        profileForm.name.trim() !== user.name ||
        profileForm.email.trim() !== user.email ||
        Boolean(profileForm.password.trim())
      )
    );
  }, [profileForm.email, profileForm.name, profileForm.password, user]);

  const handleProfileSave = async (event) => {
    event.preventDefault();

    if (!user || !canSaveProfile) {
      return;
    }

    const payload = {
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
    };

    if (profileForm.password.trim()) {
      payload.password = profileForm.password.trim();
    }

    try {
      setSavingProfile(true);
      setError('');
      setSuccess('');
      await userAPI.update(user.id || user._id, payload);
      await refreshSession();
      setProfileForm((prev) => ({ ...prev, password: '' }));
      setSuccess('Profile updated successfully.');
    } catch (saveError) {
      setError(saveError?.response?.data?.message || 'Unable to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();

    if (!isAdmin) {
      return;
    }

    try {
      setCreatingUser(true);
      setError('');
      setSuccess('');

      await userAPI.create({
        name: createUserForm.name.trim(),
        email: createUserForm.email.trim(),
        password: createUserForm.password.trim(),
        role: createUserForm.role,
      });

      setCreateUserForm(emptyCreateUserForm());
      setSuccess('User created successfully.');
      await loadUsers();
    } catch (createError) {
      setError(createError?.response?.data?.message || 'Unable to create user.');
    } finally {
      setCreatingUser(false);
    }
  };

  const handleToggleUserRole = async (targetUser) => {
    if (!isAdmin) {
      return;
    }

    const nextRole = targetUser.role === 'admin' ? 'member' : 'admin';

    try {
      setSavingUserId(targetUser.id);
      setError('');
      setSuccess('');
      await userAPI.update(targetUser.id, { role: nextRole });
      await loadUsers();
    } catch (updateError) {
      setError(updateError?.response?.data?.message || 'Unable to update role.');
    } finally {
      setSavingUserId('');
    }
  };

  const handleToggleUserActive = async (targetUser) => {
    if (!isAdmin) {
      return;
    }

    try {
      setSavingUserId(targetUser.id);
      setError('');
      setSuccess('');
      await userAPI.update(targetUser.id, { isActive: !targetUser.isActive });
      await loadUsers();
    } catch (updateError) {
      setError(updateError?.response?.data?.message || 'Unable to update active state.');
    } finally {
      setSavingUserId('');
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (!isAdmin) {
      return;
    }

    try {
      setDeletingUserId(targetUser.id);
      setError('');
      setSuccess('');
      await userAPI.delete(targetUser.id);
      await loadUsers();
      setSuccess('User deleted successfully.');
    } catch (deleteError) {
      setError(deleteError?.response?.data?.message || 'Unable to delete user.');
    } finally {
      setDeletingUserId('');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-300/10 via-blue-400/10 to-violet-300/10 p-4"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Settings</p>
        <h2 className="mt-1 text-xl font-semibold text-white">Profile and workspace access controls.</h2>
        <p className="mt-2 text-sm text-slate-300">
          {isAdmin ? 'Admin mode: profile + user management.' : 'Member mode: profile settings only.'}
        </p>
      </motion.section>

      {error ? (
        <div className="rounded-xl border border-rose-300/30 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">{error}</div>
      ) : null}
      {success ? (
        <div className="rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">{success}</div>
      ) : null}

      <section className="rounded-2xl border border-white/10 bg-[#0d1628]/90 p-4">
        <h3 className="text-sm font-semibold text-white">My Profile</h3>
        <p className="mt-1 text-xs text-slate-400">Update your account details and password.</p>

        <form onSubmit={handleProfileSave} className="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            value={profileForm.name}
            onChange={(event) => setProfileForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Full name"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none"
          />
          <input
            value={profileForm.email}
            onChange={(event) => setProfileForm((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="Email"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none"
          />
          <input
            value={profileForm.password}
            onChange={(event) => setProfileForm((prev) => ({ ...prev, password: event.target.value }))}
            type="password"
            placeholder="New password (optional)"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none sm:col-span-2"
          />
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={!canSaveProfile || savingProfile}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-400 px-3.5 py-2 text-sm font-semibold text-slate-900 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-65"
            >
              <FiSave className="h-4 w-4" />
              {savingProfile ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </section>

      {isAdmin ? (
        <section className="grid gap-3 xl:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-[#0d1628]/90 p-4">
            <h3 className="text-sm font-semibold text-white">Create User</h3>
            <p className="mt-1 text-xs text-slate-400">Create new admin/member accounts.</p>

            <form onSubmit={handleCreateUser} className="mt-3 space-y-3">
              <input
                value={createUserForm.name}
                onChange={(event) => setCreateUserForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Name"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none"
              />
              <input
                value={createUserForm.email}
                onChange={(event) => setCreateUserForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="Email"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none"
              />
              <input
                value={createUserForm.password}
                onChange={(event) => setCreateUserForm((prev) => ({ ...prev, password: event.target.value }))}
                type="password"
                placeholder="Password"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none"
              />
              <select
                value={createUserForm.role}
                onChange={(event) => setCreateUserForm((prev) => ({ ...prev, role: event.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-100 focus:border-cyan-300/40 focus:outline-none"
              >
                <option value="member" className="bg-[#0d1628]">Member</option>
                <option value="admin" className="bg-[#0d1628]">Admin</option>
              </select>
              <button
                type="submit"
                disabled={creatingUser}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-400 px-3.5 py-2 text-sm font-semibold text-slate-900 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-65"
              >
                <FiPlus className="h-4 w-4" />
                {creatingUser ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </article>

          <article className="rounded-2xl border border-white/10 bg-[#0d1628]/90 p-4">
            <h3 className="text-sm font-semibold text-white">Manage Users</h3>
            <p className="mt-1 text-xs text-slate-400">Adjust role, active state, or remove users.</p>

            <div className="mt-3 space-y-2">
              {loadingUsers ? (
                <div className="h-28 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]" />
              ) : users.length === 0 ? (
                <p className="text-sm text-slate-400">No users found.</p>
              ) : (
                users.map((workspaceUser) => {
                  const isSelf = String(workspaceUser.id) === String(user?.id || user?._id);

                  return (
                    <div key={workspaceUser.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-slate-100">{workspaceUser.name}</p>
                          <p className="text-xs text-slate-400">{workspaceUser.email}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            disabled={savingUserId === workspaceUser.id}
                            onClick={() => handleToggleUserRole(workspaceUser)}
                            className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-slate-200 hover:bg-white/10 disabled:opacity-60"
                          >
                            {workspaceUser.role}
                          </button>
                          <button
                            type="button"
                            disabled={savingUserId === workspaceUser.id}
                            onClick={() => handleToggleUserActive(workspaceUser)}
                            className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-slate-200 hover:bg-white/10 disabled:opacity-60"
                          >
                            {workspaceUser.isActive ? 'Active' : 'Inactive'}
                          </button>
                          <button
                            type="button"
                            disabled={isSelf || deletingUserId === workspaceUser.id}
                            onClick={() => handleDeleteUser(workspaceUser)}
                            className="inline-flex items-center gap-1 rounded-full border border-rose-300/30 bg-rose-300/10 px-2.5 py-1 text-xs text-rose-100 hover:bg-rose-300/15 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <FiTrash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </article>
        </section>
      ) : null}
    </div>
  );
}