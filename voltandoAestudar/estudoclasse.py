class ErroSaldoInsuficiente(Exception):
    pass

class Conta:
    def __init__(self, saldo_inicial = 0):
        self.saldo = 0
    def sacar(self, valor: int):
        if valor > self.saldo:
            raise ErroSaldoInsuficiente("Saldo insuficiente")
        if valor <= 0:
            raise ValueError("Numero informado e invalido")
        self.saldo -= valor
        print(f"Foi sacado R${valor} da sua conta")
    def depositar(self, valor: int):
        if valor <= 0:
            raise ValueError("Numero informado e invalido")
        self.saldo += valor
        print(f"Foi depositado R${valor} em sua conta")

conta = Conta()

conta.depositar(500)
conta.sacar(600)