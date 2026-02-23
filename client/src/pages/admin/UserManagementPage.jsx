import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    IconButton,
    Avatar,
    TextField,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import { Search, UserPlus, Shield, MoreVertical, Trash2, Edit } from 'lucide-react';
import mockUsers from '../../data/users.json';

const UserManagementPage = () => {
    const [users, setUsers] = useState(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRoleChange = (userId, newRole) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'manager': return 'error';
            case 'staff': return 'warning';
            case 'member': return 'info';
            default: return 'default';
        }
    };

    return (
        <Box>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
                    <p className="text-slate-500">Manage user permissions and roles across the system</p>
                </div>

                <Button
                    variant="contained"
                    startIcon={<UserPlus size={20} />}
                    className="bg-primary-600 rounded-xl px-6 py-2.5 font-bold shadow-lg shadow-primary-100"
                >
                    Add New User
                </Button>
            </div>

            <Paper className="rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
                <div className="p-6 border-b flex justify-between items-center bg-white">
                    <TextField
                        placeholder="Search users..."
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search size={18} className="text-slate-400" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: 300, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                </div>

                <TableContainer>
                    <Table>
                        <TableHead className="bg-slate-50">
                            <TableRow>
                                <TableCell className="font-bold text-slate-500">User</TableCell>
                                <TableCell className="font-bold text-slate-500">Email</TableCell>
                                <TableCell className="font-bold text-slate-500">Role</TableCell>
                                <TableCell className="font-bold text-slate-500">Status</TableCell>
                                <TableCell align="right" className="font-bold text-slate-500">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar sx={{ bgcolor: getRoleColor(user.role) + '.main' }}>{user.name[0]}</Avatar>
                                            <span className="font-bold text-slate-700">{user.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-500">{user.email}</TableCell>
                                    <TableCell>
                                        <FormControl size="small" sx={{ minWidth: 120 }}>
                                            <Select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                sx={{ borderRadius: 2, fontSize: '0.875rem' }}
                                            >
                                                <MenuItem value="member">Member</MenuItem>
                                                <MenuItem value="staff">Staff</MenuItem>
                                                <MenuItem value="manager">Manager</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.status}
                                            size="small"
                                            color={user.status === 'active' ? 'success' : 'default'}
                                            variant="light"
                                            className="font-bold capitalize"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <div className="flex justify-end gap-1">
                                            <IconButton size="small" className="text-slate-400">
                                                <Edit size={18} />
                                            </IconButton>
                                            <IconButton size="small" className="text-red-400">
                                                <Trash2 size={18} />
                                            </IconButton>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default UserManagementPage;
