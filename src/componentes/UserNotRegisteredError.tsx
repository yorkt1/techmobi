import React from 'react';

export default function UserNotRegisteredError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center p-8 border border-border rounded-sm max-w-md">
        <h1 className="text-xl font-bold mb-4">Acesso não autorizado</h1>
        <p className="text-muted-foreground mb-4">Você não possui permissão para acessar esta área ou seu usuário não está registrado.</p>
        <a href="/" className="text-primary hover:underline">Voltar para a página inicial</a>
      </div>
    </div>
  );
}
