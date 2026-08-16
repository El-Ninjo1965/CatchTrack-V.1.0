<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Platform Administration</title>
    <style>
      body { font-family: Arial, sans-serif; background: #f4f5f7; margin: 0; padding: 2rem; }
      .card { max-width: 420px; margin: 3rem auto; background: #fff; border-radius: 8px; padding: 1.5rem; box-shadow: 0 3px 12px rgba(0,0,0,.08); }
      label { display:block; margin-bottom: .3rem; font-weight: 600; }
      input { width: 100%; margin-bottom: 1rem; padding: .65rem; border: 1px solid #c7ccd1; border-radius: 6px; }
      button { width: 100%; padding: .7rem; border: 0; border-radius: 6px; background: #1f5fbf; color: #fff; font-weight: 700; }
      .error { color: #b42318; margin-bottom: .8rem; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Platform Administration</h1>
      <p>Sign in with an administrator account.</p>
      <?php if (!empty($errorMessage)): ?>
        <div class="error"><?= htmlspecialchars($errorMessage, ENT_QUOTES, 'UTF-8') ?></div>
      <?php endif; ?>
      <form method="post" action="/admin/index.php">
        <label for="username">Username</label>
        <input id="username" name="username" required />

        <label for="password">Password</label>
        <input id="password" name="password" type="password" required />

        <button type="submit">Login</button>
      </form>
    </div>
  </body>
</html>
