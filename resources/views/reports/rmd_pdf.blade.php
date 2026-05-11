<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Laporan Program RMD</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .status-badge {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
        }
        .status-selesai {
            background-color: #d1fae5;
            color: #065f46;
        }
        .status-sedang {
            background-color: #fef3c7;
            color: #92400e;
        }
        .status-belum {
            background-color: #f3f4f6;
            color: #1f2937;
        }
        .timestamp {
            font-size: 10px;
            color: #666;
            text-align: right;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>Laporan Program RMD</h2>
        <p>Child Development Program</p>
    </div>

    <div class="timestamp">
        Dicetak pada: {{ now()->format('d/m/Y H:i') }}
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama Partisipan</th>
                <th>Nomor Identitas</th>
                <th>Status</th>
                <th>%</th>
                <th>Modul</th>
                <th>Terakhir Diperbarui</th>
            </tr>
        </thead>
        <tbody>
            @foreach($reports as $index => $row)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $row->user_name }}</td>
                <td>{{ $row->user_id_number }}</td>
                <td>
                    @php
                        $statusClass = match($row->status) {
                            'Selesai' => 'status-selesai',
                            'Sedang Mengisi' => 'status-sedang',
                            default => 'status-belum',
                        };
                    @endphp
                    <span class="status-badge {{ $statusClass }}">
                        {{ $row->status }}
                    </span>
                </td>
                <td>{{ $row->percentage }}%</td>
                <td>{{ $row->filled_modules_count }} / {{ $row->total_modules }}</td>
                <td>{{ $row->last_updated ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
