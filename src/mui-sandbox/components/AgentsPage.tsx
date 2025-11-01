import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Chip,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ViewModule as ViewModuleIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  HelpOutline as HelpIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  DarkMode as DarkModeIcon,
  Apps as AppsIcon,
  SmartToy as SmartToyIcon,
  Storage as StorageIcon,
  Image as ImageIcon,
  Folder as FolderIcon,
  Build as BuildIcon,
  Extension as ExtensionIcon,
  Security as SecurityIcon,
  FiberManualRecord as CircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

interface Agent {
  id: number;
  name: string;
  status: 'running' | 'warning' | 'inactive';
  resource: string;
  agents: number;
  tools: number;
}

const mockAgents: Agent[] = [
  { id: 1, name: 'Docker Sales Research Team', status: 'running', resource: 'agent/sales-research-team', agents: 6, tools: 8 },
  { id: 2, name: 'Figma developer Team', status: 'running', resource: 'agent/sales-research-team', agents: 4, tools: 12 },
  { id: 3, name: 'Saas Product Manager', status: 'running', resource: 'agent/sales-research-team', agents: 1, tools: 8 },
  { id: 4, name: 'Fix Issue in Github', status: 'warning', resource: 'agent/sales-research-team', agents: 2, tools: 8 },
  { id: 5, name: 'Docker Captains Assistant', status: 'inactive', resource: 'agent/docker-captain-ass...', agents: 1, tools: 10 },
  { id: 6, name: 'UX Research Team', status: 'inactive', resource: 'agent/sales-research-team', agents: 5, tools: 8 },
  { id: 7, name: 'Agenda Assistant', status: 'inactive', resource: 'agent/agenda', agents: 1, tools: 7 },
  { id: 8, name: 'Market Research Team', status: 'inactive', resource: 'agent/sales-research-team', agents: 6, tools: 3 },
  { id: 9, name: 'Sprint Plan Builder', status: 'inactive', resource: 'agent/sales-research-team', agents: 2, tools: 2 },
];

const DRAWER_WIDTH = 240;

/**
 * Agents Page Component - STOCK MUI ONLY
 *
 * Built with zero theme customization - pure MUI defaults
 * This shows the baseline gap between stock MUI and the Figma design
 */
export const AgentsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedAgents, setSelectedAgents] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedAgents(mockAgents.map(agent => agent.id));
    } else {
      setSelectedAgents([]);
    }
  };

  const handleSelectAgent = (id: number) => {
    setSelectedAgents(prev =>
      prev.includes(id) ? prev.filter(agentId => agentId !== id) : [...prev, id]
    );
  };

  const getStatusIcon = (status: Agent['status']) => {
    switch (status) {
      case 'running':
        return <CircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'inactive':
        return <CircleIcon color="disabled" />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh' }}>
      {/* App Header - Stock MUI AppBar */}
      <AppBar position="static">
        <Toolbar>
          <StorageIcon />
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>
            dockerdesktop
          </Typography>
          <Chip label="BUSINESS" size="small" />
          <Box sx={{ flexGrow: 1, mx: 2 }}>
            <TextField
              size="small"
              placeholder="Search"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Chip label="⌘K" size="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <IconButton color="inherit"><HelpIcon /></IconButton>
          <IconButton color="inherit"><NotificationsIcon /></IconButton>
          <IconButton color="inherit"><SettingsIcon /></IconButton>
          <IconButton color="inherit"><DarkModeIcon /></IconButton>
          <IconButton color="inherit"><AppsIcon /></IconButton>
          <IconButton color="inherit">
            <CircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexGrow: 1, width: '100%' }}>
        {/* Sidebar - Stock MUI Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              position: 'relative',
            },
          }}
        >
          <List>
            <ListItemButton>
              <Box>
                <Typography variant="caption">Local</Typography>
                <Typography variant="caption" color="text.secondary">Desktop Engine</Typography>
              </Box>
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon><SmartToyIcon /></ListItemIcon>
              <ListItemText primary="Gordon" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon><StorageIcon /></ListItemIcon>
              <ListItemText primary="Containers" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon><ImageIcon /></ListItemIcon>
              <ListItemText primary="Images" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon><FolderIcon /></ListItemIcon>
              <ListItemText primary="Volumes" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon><BuildIcon /></ListItemIcon>
              <ListItemText primary="Builds" />
            </ListItemButton>
            <ListItemButton selected>
              <ListItemIcon><SmartToyIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Agents" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon><StorageIcon /></ListItemIcon>
              <ListItemText primary="Models" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon><BuildIcon /></ListItemIcon>
              <ListItemText primary="MCP Toolkit" />
              <Chip label="NEW" size="small" color="primary" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon><SecurityIcon /></ListItemIcon>
              <ListItemText primary="Scout" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon><ExtensionIcon /></ListItemIcon>
              <ListItemText primary="Extensions" />
            </ListItemButton>
          </List>
        </Drawer>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {/* Page Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography variant="h5">Agents</Typography>
              <Typography variant="body2" color="text.secondary">
                Create View and manage your Agents
              </Typography>
            </Box>
            <Button variant="contained">Create Agent</Button>
          </Box>

          {/* Tabs */}
          <Tabs value={selectedTab} onChange={(_, val) => setSelectedTab(val)}>
            <Tab label="My Agents" />
            <Tab label="Catalog" />
            <Tab label="Playground" />
          </Tabs>

          {/* Search and View Controls */}
          <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
            <TextField
              size="small"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flexGrow: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <IconButton><FilterListIcon /></IconButton>
            <IconButton><ViewModuleIcon /></IconButton>
          </Box>

          {/* Data Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedAgents.length === mockAgents.length}
                      indeterminate={selectedAgents.length > 0 && selectedAgents.length < mockAgents.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Resource</TableCell>
                  <TableCell>Agents</TableCell>
                  <TableCell>Tools</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockAgents.map((agent) => (
                  <TableRow key={agent.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedAgents.includes(agent.id)}
                        onChange={() => handleSelectAgent(agent.id)}
                      />
                    </TableCell>
                    <TableCell>{getStatusIcon(agent.status)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SmartToyIcon />
                        <Typography>{agent.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography color="primary">{agent.resource}</Typography>
                    </TableCell>
                    <TableCell>{agent.agents}</TableCell>
                    <TableCell>{agent.tools}</TableCell>
                    <TableCell>
                      <IconButton><MoreVertIcon /></IconButton>
                      <IconButton color="error"><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Footer Status Bar */}
      <Paper sx={{ p: 1, display: 'flex', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircleIcon color="success" fontSize="small" />
          <Typography variant="caption">Engine is running</Typography>
        </Box>
        <Typography variant="caption">RAM 0.22 GB</Typography>
        <Typography variant="caption">CPU 0.20%</Typography>
        <Typography variant="caption">Disk 10.12 GB available of 63.62 GB</Typography>
        <Typography variant="caption">Files synchronized</Typography>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Typography variant="caption">Terminal</Typography>
          <Typography variant="caption">v4.20.0</Typography>
          <Typography variant="caption">No shared ports</Typography>
        </Box>
      </Paper>
    </Box>
  );
};
