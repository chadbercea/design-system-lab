import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  Chip,
  Drawer,
  IconButton,
  InputAdornment,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  TextField,
  Toolbar,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import {
  Storage as StorageIcon,
  Search as SearchIcon,
  HelpOutline as HelpIcon,
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  Settings as SettingsIcon,
  Apps as AppsIcon,
  SmartToy as AgentIcon,
  ViewInAr as ContainersIcon,
  Image as ImagesIcon,
  Folder as VolumesIcon,
  Build as BuildsIcon,
  Extension as ExtensionIcon,
  Group as GroupIcon,
  Construction as ConstructionIcon,
  Explore as ExploreIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  GridView as GridViewIcon,
  Warning as WarningIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Code as CodeIcon,
  Visibility as VisibilityIcon,
  PlayArrow as PlayArrowIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';

export const AgentWorkflow: React.FC = () => {
  const [mainTab, setMainTab] = useState(0);
  const [detailTab, setDetailTab] = useState(0);
  const [editorMode, setEditorMode] = useState<'code' | 'visual'>('code');
  const [traceExpanded, setTraceExpanded] = useState<{ [key: number]: boolean }>({});

  // Screen 1: My Agents List
  const MyAgentsScreen = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5">Agents</Typography>
          <Typography variant="body2" color="text.secondary">
            Create View and manage your Agents
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>
          Create Agent
        </Button>
      </Box>

      <Tabs value={0}>
        <Tab label="My Agents" />
        <Tab label="Catalog" />
        <Tab label="Playground" />
      </Tabs>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Search"
          size="small"
          sx={{ flexGrow: 1, maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <IconButton size="small">
          <FilterListIcon />
        </IconButton>
        <IconButton size="small">
          <GridViewIcon />
        </IconButton>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
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
            {[
              { name: 'Docker Sales Research Team', status: 'success', resource: 'agent/sales-research-team', agents: 6, tools: 8, icon: AgentIcon },
              { name: 'Figma developer Team', status: 'success', resource: 'agent/sales-research-team', agents: 4, tools: 12, icon: AgentIcon },
              { name: 'Saas Product Manager', status: 'success', resource: 'agent/sales-research-team', agents: 1, tools: 8, icon: GroupIcon },
              { name: 'Fix Issue in Github', status: 'warning', resource: 'agent/sales-research-team', agents: 2, tools: 8, icon: AgentIcon },
              { name: 'Docker Captains Assistant', status: 'idle', resource: 'agent/docker-captain-ass...', agents: 1, tools: 10, icon: GroupIcon },
              { name: 'UX Research Team', status: 'idle', resource: 'agent/sales-research-team', agents: 5, tools: 8, icon: AgentIcon },
              { name: 'Agenda Assistant', status: 'idle', resource: 'agent/agenda', agents: 1, tools: 7, icon: AgentIcon },
              { name: 'Market Research Team', status: 'idle', resource: 'agent/sales-research-team', agents: 6, tools: 3, icon: AgentIcon },
              { name: 'Sprint Plan Builder', status: 'idle', resource: 'agent/sales-research-team', agents: 2, tools: 2, icon: AgentIcon },
            ].map((agent, idx) => (
              <TableRow key={idx} hover>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>
                  {agent.status === 'success' && <CircleIcon sx={{ fontSize: 12, color: 'success.main' }} />}
                  {agent.status === 'warning' && <WarningIcon sx={{ fontSize: 16, color: 'warning.main' }} />}
                  {agent.status === 'idle' && <CircleIcon sx={{ fontSize: 12, color: 'grey.400' }} />}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <agent.icon sx={{ fontSize: 20 }} />
                    <Link
                      component="button"
                      onClick={() => setMainTab(1)}
                      sx={{ textAlign: 'left' }}
                    >
                      {agent.name}
                    </Link>
                  </Box>
                </TableCell>
                <TableCell>
                  <Link>{agent.resource}</Link>
                </TableCell>
                <TableCell>{agent.agents}</TableCell>
                <TableCell>{agent.tools}</TableCell>
                <TableCell>
                  <IconButton size="small">
                    <MoreVertIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Screen 2: Configuration Tab
  const ConfigurationScreen = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Name and description</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              defaultValue="Docker Sales Research Team"
              fullWidth
            />
            <TextField
              label="Description"
              defaultValue="Docker AE/BDR Master Agent - Orchestrates account research and reporting based on the Docker AE Playbook."
              multiline
              rows={4}
              fullWidth
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>AI Providers</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Select your AI provider{' '}
                <Link href="#">Learn more</Link>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Checkbox />
              <Typography>Enable Docker AI Gateway</Typography>
              <Chip label="BETA" size="small" color="primary" />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Checkbox defaultChecked />
                <Typography>Docker Model Runner</Typography>
              </Box>
              <Select
                size="small"
                defaultValue=""
                displayEmpty
                sx={{ ml: 4, width: 200 }}
              >
                <MenuItem value="">Select Model</MenuItem>
              </Select>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Checkbox defaultChecked />
                <Typography>Anthropic (Claude...)</Typography>
              </Box>
              <Box sx={{ ml: 4, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  OpenAI API TOKEN
                </Typography>
                <TextField
                  size="small"
                  defaultValue="sk-fqke12345678900abcdefghijklmnopqrstuv"
                  type="password"
                  fullWidth
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Checkbox />
              <Typography>OpenAI (ChatGPT...)</Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );

  // Screen 3: Instructions Tab with Code Editor
  const InstructionsScreen = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '600px' }}>
      <ToggleButtonGroup
        value={editorMode}
        exclusive
        onChange={(e, val) => val && setEditorMode(val)}
        size="small"
      >
        <ToggleButton value="code">
          <CodeIcon sx={{ mr: 1 }} />
          Code editor
        </ToggleButton>
        <ToggleButton value="visual">
          <VisibilityIcon sx={{ mr: 1 }} />
          Visual Editor
        </ToggleButton>
      </ToggleButtonGroup>

      <Paper
        sx={{
          flexGrow: 1,
          bgcolor: '#1e1e1e',
          color: '#d4d4d4',
          p: 2,
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          overflow: 'auto',
        }}
      >
        <pre style={{ margin: 0 }}>
{`You are the Master Agent for Docker Sales Intelligence. Your purpose is to orchestrate a team of specialized research

## Your Guiding Principles (from the Docker Sales Playbook) ##
   * **Account Tiers & Growth Potential:** Tiers dictate effort. Tier 1 accounts have high ($50k+) ARR potential
   * **Sales Motions & Key Indicators:** These are the plays we run. You must find evidence for them.
     - Select 1: For companies modernizing applications. Target audience: organizations with large develop
       * Key indicators:
         Digital transformation initiatives
         Microservices adoption
         DevOps/container job postings
         Large developer headcount
   * **Objective 1** Position Docker as the foundational tool for building, sharing, and running cloud
     * Indicators:
       High Developer Count: Filter for companies that indicate large dev org sizes (if known)
       Low or No Current Subscription: Filter out existing Docker customers to focus on net
       Industry: Look for "tech-forward" verticals—software, financial services, e-commerce, etc.
       Intent Signal: Companies that have a GSOL or search intent for applicable topics (e.g., "cloud
     * Messaging:
       Developer Productivity: Docker shortens dev cycles and ensures consistent dev-to-prod envir
       Security & Supply Chain: Avoid vulnerabilities with verified images and scanning.
       Future-Proofing: Docker's ecosystem (Docker Build Cloud, Test Containers) grows with them.`}
        </pre>
      </Paper>
    </Box>
  );

  // Screen 4: Tools Tab
  const ToolsScreen = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Checkbox defaultChecked />
        <Typography variant="h6">MCP Toolkit</Typography>
        <Chip label="2" size="small" />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>G</Avatar>
            <Typography>Google Drive</Typography>
          </Box>
          <IconButton>
            <ChevronRightIcon />
          </IconButton>
        </Paper>

        <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>S</Avatar>
            <Typography>Stripe</Typography>
          </Box>
          <IconButton>
            <ChevronRightIcon />
          </IconButton>
        </Paper>

        <Button variant="outlined" startIcon={<AddIcon />} sx={{ alignSelf: 'flex-start' }}>
          Add MCP From Toolkit
        </Button>
      </Box>

      <Divider />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Checkbox defaultChecked />
        <Typography variant="h6">Custom MCPs</Typography>
        <Chip label="6" size="small" />
      </Box>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Custom Brave MCP</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Name" defaultValue="Brave MCP" fullWidth />
            <TextField
              label="Command"
              defaultValue="/Users/javieralonso/.local/share/MyBrave/bin/npx-fleur"
              fullWidth
            />
            <TextField
              label="Arguments"
              defaultValue="-y
@modelcontextprotocol/server-brave-search"
              multiline
              rows={2}
              fullWidth
            />
            <Typography variant="caption" color="text.secondary">
              One Per Line
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              Selected Tools
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );

  // Screen 5: Tests Tab
  const TestsScreen = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box
        sx={{
          height: 80,
          bgcolor: 'grey.100',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'flex-end',
          p: 1,
          gap: 0.5,
        }}
      >
        {Array.from({ length: 50 }).map((_, i) => (
          <Box
            key={i}
            sx={{
              width: 4,
              height: `${Math.random() * 60 + 20}px`,
              bgcolor: i % 3 === 0 ? 'error.main' : i % 3 === 1 ? 'warning.main' : 'info.main',
              borderRadius: 0.5,
            }}
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Chip icon={<InfoIcon />} label="Last 24h" />
        <Chip icon={<CheckCircleIcon />} label="Passed: 3 tests" color="success" />
        <Chip icon={<WarningIcon />} label="Warning: 3 tests" color="warning" />
        <Chip icon={<ErrorIcon />} label="Error: 3 tests" color="error" />
        <Chip icon={<InfoIcon />} label="No Executed: 10 tests" />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Search"
          size="small"
          sx={{ flexGrow: 1, maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <IconButton size="small">
          <FilterListIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="outlined" startIcon={<PlayArrowIcon />}>
          Generate Tests
        </Button>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Test
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Test Name</TableCell>
              <TableCell>Tools</TableCell>
              <TableCell>Providers</TableCell>
              <TableCell>Runtime</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              { name: 'Verify Report', status: 'success', tools: ['GD', 'S'], providers: ['A', 'O', 'D', 'C'], runtime: 'cagent' },
              { name: 'Test Leads Summarization', status: 'success', tools: ['GD', 'S'], providers: ['A', 'O'], runtime: 'cagent' },
              { name: 'Organize Leads in Tiers', status: 'success', tools: ['GD'], providers: ['A', 'O', 'D'], runtime: 'cagent' },
              { name: 'Test Lead Tier Classification', status: 'warning', tools: ['GD', 'S', 'A'], providers: ['A'], runtime: 'cagent' },
              { name: 'Get Pending Payments', status: 'error', tools: ['S'], providers: ['A', 'D'], runtime: 'cagent' },
              { name: 'Get Most Important Jira Issues', status: 'error', tools: ['J'], providers: ['A', 'O', 'J'], runtime: 'cagent' },
            ].map((test, idx) => (
              <TableRow key={idx} hover>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <ChevronRightIcon />
                  </IconButton>
                  {test.status === 'success' && <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />}
                  {test.status === 'warning' && <WarningIcon sx={{ fontSize: 16, color: 'warning.main' }} />}
                  {test.status === 'error' && <ErrorIcon sx={{ fontSize: 16, color: 'error.main' }} />}
                </TableCell>
                <TableCell>{test.name}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {test.tools.map((t, i) => (
                      <Avatar key={i} sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                        {t}
                      </Avatar>
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {test.providers.map((p, i) => (
                      <Avatar key={i} sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                        {p}
                      </Avatar>
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Link>{test.runtime}</Link>
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <PlayArrowIcon />
                  </IconButton>
                  <IconButton size="small">
                    <MoreVertIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Screen 6: Logs Tab
  const LogsScreen = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Message</TableCell>
              <TableCell width={100}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              { time: '2025-04-08 10:49:14', level: 'debug', msg: 'Agent stderr: time=2025-09-03T20:00:37.216+02:00 level=DEBUG msg=Anthropi...' },
              { time: '2025-04-08 10:51:07', level: 'warn', msg: "level=WARN msg='Error Processing stream' agent=root" },
              { time: '2025-04-08 10:52:14', level: 'error', msg: "level=ERROR msg='Context limit reached' agent=root total_messages=92" },
              { time: '2025-04-08 10:49:14', level: 'debug', msg: "level=DEBUG msg='Using agent tool handler' tool=write_file" },
              { time: '2024-04-08 10:49:14', level: 'debug', msg: "level=DEBUG msg='Tools approved, running tool' tool=write_file session_id=63d674a2-1c95-4eb4-a167-bd96d3ec1bc3" },
              { time: '2024-04-08 10:49:14', level: 'debug', msg: "Agent stderr: time=2025-09-03T20:00:37.556+02:00 level=DEBUG msg='Agent tool call completed' tool=write_file output_length=5" },
              { time: '2024-04-08 10:49:14', level: 'debug', msg: "level=DEBUG msg='Starting conversation loop iteration' agent=root" },
              { time: '2024-04-08 10:49:14', level: 'debug', msg: "level=DEBUG msg='Getting messages for agent' agent=root session_id=63d674a2-1c95-4eb4-a167-bd96d3ec1bc3" },
              { time: '2024-04-08 10:49:14', level: 'debug', msg: "level=DEBUG msg='Retrieved messages for agent' agent=root session_id=63d674a2-1c95-4eb4-a167-bd96d3ec1bc3 total_mes..." },
              { time: '2024-04-08 10:49:14', level: 'debug', msg: "level=DEBUG msg='Retrieved messages for processing' agent=root message_count=8" },
              { time: '2024-04-08 10:49:14', level: 'debug', msg: "msg='Creating chat completion stream' agent=root" },
              { time: '2024-04-08 10:49:14', level: 'debug', msg: "msg='Creating Anthropic chat completion stream' model=claude-sonnet-4-0 message_count=8 tool_count=15" },
              { time: '2024-04-08 10:49:14', level: 'debug', msg: "level=DEBUG msg='Adding tools to Anthropic request' tool_count=15" },
              { time: '2024-04-08 10:49:14', level: 'debug', msg: "msg='Creating Anthropic chat completion stream' model=claude-sonnet-4-0 message_count=8 tool_count=15" },
            ].map((log, idx) => (
              <TableRow key={idx} hover>
                <TableCell>
                  {log.level === 'warn' && <WarningIcon sx={{ fontSize: 16, color: 'warning.main', mr: 1 }} />}
                  {log.level === 'error' && <ErrorIcon sx={{ fontSize: 16, color: 'error.main', mr: 1 }} />}
                  <Typography variant="body2" component="span">
                    {log.time}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{log.msg}</Typography>
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <SearchIcon />
                  </IconButton>
                  <IconButton size="small">
                    <FilterListIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Screen 7: Traces Tab
  const TracesScreen = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Search"
          size="small"
          sx={{ flexGrow: 1, maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <IconButton size="small">
          <FilterListIcon />
        </IconButton>
        <IconButton size="small">
          <GridViewIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Select size="small" defaultValue="7days">
          <MenuItem value="7days">Last 7 days</MenuItem>
          <MenuItem value="30days">Last 30 days</MenuItem>
        </Select>
        <Select size="small" defaultValue="all">
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="success">Success</MenuItem>
          <MenuItem value="error">Error</MenuItem>
        </Select>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Sessions</TableCell>
              <TableCell>Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              {
                id: '24d29603-84d...',
                time: '08-04-2025 10:49:14',
                session: '1:C 23 Mar 2024 10:13:40.772',
                msg: '# Warning: no MCP config found, using the default',
                steps: [
                  { type: 'prompt', label: 'User Prompt', duration: '400MS' },
                  { type: 'llm', label: 'Claude Opus 4', duration: '224MS', badge: 'AI Model' },
                  { type: 'prompt', label: 'User Prompt', duration: '400MS' },
                  { type: 'task', label: 'Transfer Task', duration: '31MS' },
                  { type: 'developer', label: 'Developer', duration: '' },
                  { type: 'response', label: 'ChatGPT 4o', duration: '224MS' },
                  { type: 'task', label: 'Transfer Task', duration: '31MS' },
                  { type: 'designer', label: 'Designer', duration: '' },
                  { type: 'error', label: 'MCP Toolkit', duration: '31MS', badge: 'Failed: Executing tool' },
                ],
                expanded: false,
              },
              {
                id: 'da28514f...',
                time: '08-03-2025 09:49:14',
                session: '1:C 23 Mar 2024 10:13:40.772',
                msg: '# Warning: no MCP config found, using the default',
                steps: [],
                badge: 'TEST',
                expanded: false,
              },
              {
                id: 'da28514f...',
                time: '08-03-2025 09:49:14',
                session: '1:C 23 Mar 2024 10:13:40.772',
                msg: '# Warning: no MCP config found, using the default',
                steps: [],
                badge: 'TEST',
                expanded: false,
              },
            ].map((trace, idx) => (
              <React.Fragment key={idx}>
                <TableRow hover>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          setTraceExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }))
                        }
                      >
                        {traceExpanded[idx] ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                      </IconButton>
                      <Typography variant="body2">{trace.time}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Link>{trace.id}</Link>
                      {trace.badge && (
                        <Chip label={trace.badge} size="small" color="primary" sx={{ ml: 1 }} />
                      )}
                      <Typography variant="caption" display="block" color="text.secondary">
                        {trace.session}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{trace.msg}</Typography>
                  </TableCell>
                </TableRow>
                {traceExpanded[idx] && trace.steps.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ bgcolor: 'grey.50' }}>
                      <Box sx={{ pl: 4, pr: 2, py: 2 }}>
                        {trace.steps.map((step, stepIdx) => (
                          <Box
                            key={stepIdx}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              mb: stepIdx < trace.steps.length - 1 ? 1 : 0,
                              ml: stepIdx * 2,
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {step.type === 'prompt' && <ChatIcon sx={{ fontSize: 16 }} />}
                              {step.type === 'llm' && <SmartToyIcon sx={{ fontSize: 16 }} />}
                              {step.type === 'task' && <PlayArrowIcon sx={{ fontSize: 16 }} />}
                              {step.type === 'developer' && <PersonIcon sx={{ fontSize: 16 }} />}
                              {step.type === 'designer' && <PersonIcon sx={{ fontSize: 16 }} />}
                              {step.type === 'response' && <SmartToyIcon sx={{ fontSize: 16 }} />}
                              {step.type === 'error' && <ErrorIcon sx={{ fontSize: 16, color: 'error.main' }} />}
                              <Typography variant="body2">{step.label}</Typography>
                              {step.badge && (
                                <Chip
                                  label={step.badge}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.65rem',
                                    bgcolor: step.type === 'error' ? 'error.main' : 'grey.800',
                                    color: 'white',
                                  }}
                                />
                              )}
                            </Box>
                            <Box
                              sx={{
                                flexGrow: 1,
                                height: 4,
                                bgcolor: 'info.main',
                                borderRadius: 1,
                                maxWidth: step.duration === '' ? 0 : 200,
                              }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {step.duration}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Import missing icons
  const ChatIcon = (props: any) => <MailIcon {...props} />;
  const PersonIcon = (props: any) => <GroupIcon {...props} />;
  const MessageIcon = (props: any) => <MailIcon {...props} />;

  const DetailView = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => setMainTab(0)}>
          <ArrowBackIcon />
        </IconButton>
        <Breadcrumbs>
          <Link component="button" onClick={() => setMainTab(0)}>
            Agents
          </Link>
          <Typography>Docker Sales Research Team</Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AgentIcon />
          <Typography variant="h5">Docker Sales Research Team</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined">Test</Button>
          <Button variant="contained">Run</Button>
          <IconButton color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>

      <Tabs value={detailTab} onChange={(e, val) => setDetailTab(val)}>
        <Tab label="Configuration" />
        <Tab label="Instructions" />
        <Tab label="Tools" />
        <Tab label="Tests" />
        <Tab label="Logs" />
        <Tab label="Traces" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {detailTab === 0 && <ConfigurationScreen />}
        {detailTab === 1 && <InstructionsScreen />}
        {detailTab === 2 && <ToolsScreen />}
        {detailTab === 3 && <TestsScreen />}
        {detailTab === 4 && <LogsScreen />}
        {detailTab === 5 && <TracesScreen />}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <StorageIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            dockerdesktop
          </Typography>
          <Chip label="BUSINESS" size="small" sx={{ mr: 2 }} />
          <TextField
            placeholder="Search"
            size="small"
            sx={{ width: 200, mr: 2, bgcolor: 'rgba(255,255,255,0.15)' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Chip label="⌘K" size="small" variant="outlined" sx={{ mr: 2 }} />
          <IconButton color="inherit">
            <HelpIcon />
          </IconButton>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit">
            <MailIcon />
          </IconButton>
          <IconButton color="inherit">
            <SettingsIcon />
          </IconButton>
          <IconButton color="inherit">
            <AppsIcon />
          </IconButton>
          <Avatar sx={{ ml: 1, width: 32, height: 32 }} />
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexGrow: 1, width: '100%' }}>
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
              position: 'relative',
            },
          }}
        >
          <List>
            <ListItemButton>
              <ListItemIcon>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText primary="Local" secondary="Desktop Engine" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <AgentIcon />
              </ListItemIcon>
              <ListItemText primary="Gordon" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <ContainersIcon />
              </ListItemIcon>
              <ListItemText primary="Containers" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <ImagesIcon />
              </ListItemIcon>
              <ListItemText primary="Images" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <VolumesIcon />
              </ListItemIcon>
              <ListItemText primary="Volumes" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <BuildsIcon />
              </ListItemIcon>
              <ListItemText primary="Builds" />
            </ListItemButton>
            <ListItemButton selected>
              <ListItemIcon>
                <AgentIcon />
              </ListItemIcon>
              <ListItemText primary="Agents" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="Models" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <ConstructionIcon />
              </ListItemIcon>
              <ListItemText primary="MCP Toolkit" />
              <Chip label="NEW" size="small" color="primary" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <ExploreIcon />
              </ListItemIcon>
              <ListItemText primary="Scout" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <ExtensionIcon />
              </ListItemIcon>
              <ListItemText primary="Extensions" />
            </ListItemButton>
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {mainTab === 0 ? <MyAgentsScreen /> : <DetailView />}
        </Box>
      </Box>
    </Box>
  );
};
