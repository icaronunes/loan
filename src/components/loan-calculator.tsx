"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Briefcase, CalendarDays, Percent, Landmark, HandCoins, TrendingUp, Wallet } from 'lucide-react';

// Helper to format currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

interface LoanParams {
  amount: number;
  rate: number; // Annual interest rate
  term: number; // In months
}

interface LoanCalculationResult {
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
}

const calculateLoan = ({ amount, rate, term }: LoanParams): LoanCalculationResult => {
  if (amount <= 0 || rate <= 0 || term <= 0) {
    return { monthlyPayment: 0, totalInterest: 0, totalRepayment: amount > 0 ? amount : 0 };
  }

  const monthlyRate = rate / 12 / 100;
  const n = term; 

  if (monthlyRate === 0) {
    const monthlyPayment = amount / n;
    return {
      monthlyPayment,
      totalInterest: 0,
      totalRepayment: amount,
    };
  }
  
  const monthlyPaymentFormula = amount * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  const monthlyPayment = isNaN(monthlyPaymentFormula) || !isFinite(monthlyPaymentFormula) ? 0 : monthlyPaymentFormula;
  
  const totalRepayment = monthlyPayment * n;
  const totalInterest = totalRepayment - amount;

  return {
    monthlyPayment,
    totalInterest: isNaN(totalInterest) || !isFinite(totalInterest) ? 0 : totalInterest,
    totalRepayment: isNaN(totalRepayment) || !isFinite(totalRepayment) ? 0 : totalRepayment,
  };
};


export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(50000);
  const [interestRate, setInterestRate] = useState<number>(12); 
  const [loanTerm, setLoanTerm] = useState<number>(36); 

  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalRepayment, setTotalRepayment] = useState<number>(0);
  
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);


  useEffect(() => {
    const results = calculateLoan({
      amount: loanAmount,
      rate: interestRate,
      term: loanTerm,
    });
    setMonthlyPayment(results.monthlyPayment);
    setTotalInterest(results.totalInterest);
    setTotalRepayment(results.totalRepayment);
  }, [loanAmount, interestRate, loanTerm]);

  const handleAmountSliderChange = (value: number[]) => {
    setLoanAmount(value[0]);
  };
  const handleLoanAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseFloat(e.target.value);
    if (isNaN(val)) val = 1000;
    setLoanAmount(Math.max(1000, Math.min(val, 200000)));
  };

  const handleRateSliderChange = (value: number[]) => {
    setInterestRate(value[0]);
  };
  const handleInterestRateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseFloat(e.target.value);
    if (isNaN(val)) val = 1;
    setInterestRate(Math.max(1, Math.min(val, 30)));
  };
  
  const handleTermSliderChange = (value: number[]) => {
    setLoanTerm(value[0]);
  };
  const handleLoanTermInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = 6;
    setLoanTerm(Math.max(6, Math.min(val, 72)));
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-4 sm:p-8 bg-background">
      <Card className="w-full max-w-2xl shadow-2xl rounded-xl overflow-hidden">
        <CardHeader className="text-center bg-primary/10 p-6">
          <div className="flex justify-center items-center mb-3">
            <Briefcase className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Simulador de Empréstimo Simploan</CardTitle>
          <CardDescription className="text-md text-muted-foreground pt-1">
            Ajuste os valores para simular seu empréstimo de forma clara e rápida.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-6 sm:p-8">
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="loanAmountInput" className="text-lg font-medium flex items-center gap-2 text-foreground">
                <HandCoins className="w-5 h-5 text-primary" />
                Dinheiro Solicitado
              </Label>
              <Input
                id="loanAmountInput"
                type="number"
                value={loanAmount.toString()} // Keep as string for input field
                onChange={handleLoanAmountInputChange}
                min="1000"
                max="200000"
                className="w-44 text-right font-semibold text-lg"
              />
            </div>
            <Slider
              id="loanAmountSlider"
              min={1000}
              max={200000}
              step={1000}
              value={[loanAmount]}
              onValueChange={handleAmountSliderChange}
              className="[&>span:first-child]:bg-primary [&>span:first-child_span]:bg-primary-foreground"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatCurrency(1000)}</span>
              <span>{formatCurrency(200000)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="interestRateInput" className="text-lg font-medium flex items-center gap-2 text-foreground">
                <Percent className="w-5 h-5 text-primary" />
                Taxa de Juros Anual (%)
              </Label>
              <Input
                id="interestRateInput"
                type="number"
                value={interestRate.toString()}
                onChange={handleInterestRateInputChange}
                step="0.1"
                min="1"
                max="30"
                className="w-32 text-right font-semibold text-lg"
              />
            </div>
            <Slider
              id="interestRateSlider"
              min={1}
              max={30}
              step={0.1}
              value={[interestRate]}
              onValueChange={handleRateSliderChange}
              className="[&>span:first-child]:bg-primary [&>span:first-child_span]:bg-primary-foreground"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>1%</span>
              <span>30%</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="loanTermInput" className="text-lg font-medium flex items-center gap-2 text-foreground">
                <CalendarDays className="w-5 h-5 text-primary" />
                Quantidade de Meses
              </Label>
              <Input
                id="loanTermInput"
                type="number"
                value={loanTerm.toString()}
                onChange={handleLoanTermInputChange}
                min="6"
                max="72"
                className="w-32 text-right font-semibold text-lg"
              />
            </div>
            <Slider
              id="loanTermSlider"
              min={6}
              max={72}
              step={1}
              value={[loanTerm]}
              onValueChange={handleTermSliderChange}
              className="[&>span:first-child]:bg-primary [&>span:first-child_span]:bg-primary-foreground"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>6 meses</span>
              <span>72 meses</span>
            </div>
          </div>

          <Separator className="my-6 bg-border/70" />

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-center text-primary">Resumo da Simulação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <ResultCard
                icon={<Wallet className="w-7 h-7 sm:w-8 sm:h-8 text-accent" />}
                label="Parcela Mensal"
                value={formatCurrency(monthlyPayment)}
                isAccent
              />
              <ResultCard
                icon={<TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-destructive" />}
                label="Total de Juros Pagos"
                value={formatCurrency(totalInterest)}
              />
              <ResultCard
                icon={<Landmark className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />}
                label="Montante Total a Pagar"
                value={formatCurrency(totalRepayment)}
              />
               <ResultCard
                icon={<HandCoins className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />}
                label="Valor Solicitado"
                value={formatCurrency(loanAmount)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-center p-6 bg-secondary/30">
          <p className="text-xs text-muted-foreground">
            Esta é uma simulação e os valores podem variar. Consulte as condições reais com a instituição financeira.
          </p>
          {currentYear !== null && (
             <p className="text-xs text-muted-foreground mt-1">
               Simploan &copy; {currentYear}
             </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

interface ResultCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isAccent?: boolean;
}

function ResultCard({ icon, label, value, isAccent = false }: ResultCardProps) {
  return (
    <div className={`p-4 sm:p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg ${isAccent ? 'bg-accent/5 hover:bg-accent/10' : 'bg-card hover:bg-secondary/30'} border border-transparent hover:border-primary/20`}>
      <div className="mb-2 sm:mb-3">{icon}</div>
      <p className={`text-sm font-medium ${isAccent ? 'text-accent' : 'text-muted-foreground'}`}>{label}</p>
      <p className={`text-xl sm:text-2xl font-bold ${isAccent ? 'text-accent' : 'text-foreground'}`}>{value}</p>
    </div>
  );
}
