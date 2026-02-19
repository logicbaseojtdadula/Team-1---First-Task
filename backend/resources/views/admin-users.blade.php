<!DOCTYPE html>
<html>
<head>
    <title>Admin - View Users</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: Arial, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        h1 { 
            color: #667eea; 
            margin-bottom: 10px;
            font-size: 32px;
        }
        .stats {
            display: flex;
            gap: 20px;
            margin: 20px 0;
        }
        .stat-card {
            flex: 1;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 8px;
            text-align: center;
        }
        .stat-number { font-size: 36px; font-weight: bold; }
        .stat-label { font-size: 14px; opacity: 0.9; margin-top: 5px; }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px;
        }
        th { 
            background: #667eea; 
            color: white; 
            padding: 15px; 
            text-align: left;
            font-weight: 500;
        }
        td { 
            padding: 12px 15px; 
            border-bottom: 1px solid #eee;
        }
        tr:hover { background: #f8f9fa; }
        .role-badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            display: inline-block;
        }
        .role-customer { background: #4ecdc4; color: white; }
        .role-frontend { background: #95e1d3; color: #333; }
        .role-backend { background: #f38181; color: white; }
        .role-server { background: #aa96da; color: white; }
        .refresh-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            margin-bottom: 20px;
        }
        .refresh-btn:hover { background: #5568d3; }
        .timestamp { color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>👥 Registered Users</h1>
        <p style="color: #666; margin-bottom: 20px;">View all registered users in the system</p>
        
        <button class="refresh-btn" onclick="location.reload()">🔄 Refresh</button>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">{{ $users->count() }}</div>
                <div class="stat-label">Total Users</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{{ $users->where('role', 'customer')->count() }}</div>
                <div class="stat-label">Customers</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{{ $users->whereIn('role', ['frontend', 'backend', 'server'])->count() }}</div>
                <div class="stat-label">Developers</div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Registered</th>
                </tr>
            </thead>
            <tbody>
                @foreach($users as $user)
                <tr>
                    <td>#{{ $user->id }}</td>
                    <td>{{ $user->name }}</td>
                    <td>{{ $user->email }}</td>
                    <td>
                        <span class="role-badge role-{{ $user->role }}">
                            {{ ucfirst($user->role) }}
                        </span>
                    </td>
                    <td class="timestamp">{{ $user->created_at->format('M d, Y h:i A') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</body>
</html>
