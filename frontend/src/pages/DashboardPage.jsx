import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';

const stats = [
  { label: 'Total Users', value: '1,248', tone: '#60a5fa' },
  { label: 'Active Roles', value: '12', tone: '#34d399' },
  { label: 'Pending Tasks', value: '18', tone: '#fbbf24' },
  { label: 'Revenue', value: '$42.6K', tone: '#c084fc' },
];

const recentActivity = [
  'New staff member added to sales role',
  'Inventory policy updated by the admin',
  'Customer support queue cleared',
  'Role permissions changed for finance team',
];

function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <Typography variant="overline" sx={{ color: '#a78bfa', letterSpacing: 2, display: 'block', mb: 1 }}>
            Overview
          </Typography>
          <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700 }}>
            Dashboard
          </Typography>
        </div>
      </header>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 4, flexWrap: 'wrap' }}>
        {stats.map((item) => (
          <Card
            key={item.label}
            sx={{
              flex: '1 1 220px',
              minWidth: 180,
              background: 'rgba(15,23,42,0.8)',
              border: '1px solid rgba(148,163,184,0.12)',
              boxShadow: '0 16px 40px rgba(15,23,42,0.22)',
            }}
          >
            <CardContent>
              <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 1 }}>
                {item.label}
              </Typography>
              <Typography variant="h4" sx={{ color: item.tone, fontWeight: 700 }}>
                {item.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Card
        sx={{
          background: 'rgba(15,23,42,0.8)',
          border: '1px solid rgba(148,163,184,0.12)',
          boxShadow: '0 16px 40px rgba(15,23,42,0.22)',
        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
            Recent activity
          </Typography>

          <List sx={{ p: 0 }}>
            {recentActivity.map((item) => (
              <ListItem
                key={item}
                sx={{
                  background: 'rgba(30,41,59,0.7)',
                  borderRadius: 2,
                  mb: 1,
                  px: 2,
                  py: 1.5,
                }}
              >
                <ListItemText
                  primary={item}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: '#dbeafe',
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardPage;
