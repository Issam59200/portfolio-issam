<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea, #74b9ff); color: white; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 20px; }
        .body { padding: 28px; }
        .field { margin-bottom: 16px; }
        .field label { display: block; font-size: 12px; text-transform: uppercase; color: #888; margin-bottom: 4px; }
        .field p { margin: 0; color: #333; font-size: 15px; }
        .message-box { background: #f8f9fa; border-left: 4px solid #74b9ff; padding: 16px; border-radius: 4px; white-space: pre-wrap; color: #333; }
        .footer { background: #f4f4f4; padding: 16px; text-align: center; font-size: 12px; color: #888; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Nouveau message depuis ton Portfolio</h1>
        </div>
        <div class="body">
            <div class="field">
                <label>Nom</label>
                <p>{{ $contact->name }}</p>
            </div>
            <div class="field">
                <label>Email</label>
                <p><a href="mailto:{{ $contact->email }}">{{ $contact->email }}</a></p>
            </div>
            @if($contact->subject)
            <div class="field">
                <label>Sujet</label>
                <p>{{ $contact->subject }}</p>
            </div>
            @endif
            <div class="field">
                <label>Message</label>
                <div class="message-box">{{ $contact->message }}</div>
            </div>
        </div>
        <div class="footer">
            Reçu le {{ $contact->created_at->format('d/m/Y à H:i') }} — Portfolio Issam Atrari
        </div>
    </div>
</body>
</html>
