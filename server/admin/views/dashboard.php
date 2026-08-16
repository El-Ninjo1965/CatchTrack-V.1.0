<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Platform Administration Dashboard</title>
    <style>
      body { font-family: Arial, sans-serif; background: #f4f5f7; margin: 0; padding: 2rem; }
      .layout { max-width: 1000px; margin: 0 auto; }
      .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; }
      .card { background: #fff; border-radius: 8px; padding: 1rem; box-shadow: 0 3px 12px rgba(0,0,0,.08); }
      table { width: 100%; border-collapse: collapse; font-size: .9rem; }
      th, td { border-bottom: 1px solid #d9dde2; text-align: left; padding: .4rem; }
      a { color: #1f5fbf; text-decoration: none; }
    </style>
  </head>
  <body>
    <div class="layout">
      <div class="topbar">
        <div>
          <h1>Administration Dashboard</h1>
          <p>Signed in as <?= htmlspecialchars((string) $user['display_name'], ENT_QUOTES, 'UTF-8') ?> (<?= htmlspecialchars((string) $user['username'], ENT_QUOTES, 'UTF-8') ?>)</p>
        </div>
        <a href="/admin/logout.php">Logout</a>
      </div>

      <div class="grid">
        <div class="card">
          <h2>Users</h2>
          <table>
            <thead><tr><th>Username</th><th>Status</th></tr></thead>
            <tbody>
              <?php foreach ($users as $entry): ?>
              <tr>
                <td><?= htmlspecialchars((string) $entry['username'], ENT_QUOTES, 'UTF-8') ?></td>
                <td><?= htmlspecialchars((string) $entry['status'], ENT_QUOTES, 'UTF-8') ?></td>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>

        <div class="card">
          <h2>Roles</h2>
          <table>
            <thead><tr><th>Name</th><th>Description</th></tr></thead>
            <tbody>
              <?php foreach ($roles as $entry): ?>
              <tr>
                <td><?= htmlspecialchars((string) $entry['name'], ENT_QUOTES, 'UTF-8') ?></td>
                <td><?= htmlspecialchars((string) $entry['description'], ENT_QUOTES, 'UTF-8') ?></td>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>

        <div class="card">
          <h2>Modules</h2>
          <table>
            <thead><tr><th>Name</th><th>Slug</th><th>Status</th></tr></thead>
            <tbody>
              <?php foreach ($modules as $entry): ?>
              <tr>
                <td><?= htmlspecialchars((string) $entry['name'], ENT_QUOTES, 'UTF-8') ?></td>
                <td><?= htmlspecialchars((string) $entry['slug'], ENT_QUOTES, 'UTF-8') ?></td>
                <td><?= htmlspecialchars((string) ($entry['status'] ?? 'unknown'), ENT_QUOTES, 'UTF-8') ?></td>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </body>
</html>
