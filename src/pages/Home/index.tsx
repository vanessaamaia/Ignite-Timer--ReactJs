import { HandPalm, Play } from "phosphor-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useEffect, useState } from "react";
import { differenceInSeconds } from 'date-fns';
import { NewCycleForm } from './components/NewCycleForm';
import { Countdown } from './components/Countdown'

import {
    CountdownContainer, 
    FormContainer,
    HomeContainer,
    MinutesAmountInput,
    Separator,
    StartCountdownButton,
    StopCountdownButton,
    TaskInput
} from "./styles";

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod
    .number()
    .min(5, 'O cilco precisa ser no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ser no máximo 60 minutos.'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>
interface Cycle {
    id: string
    task: string
    minutesAmount: number
    startDate: Date
    interruptedDate?: Date
    finisheadDate?: Date
}

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<String | null>(null)
    const [amountSecondPassed, setAmountSecondPassed] = useState(0)

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    })

    const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)

    useEffect(() => {
        let interval: number

        if (activeCycle) {
            interval = setInterval(() => {
                const secondsDifference = differenceInSeconds(
                    new Date(),
                    activeCycle.startDate,
                )

                if (secondsDifference >= totalSeconds) {
                    setCycles((state) => state.map((cycle) => {
                        if (cycle.id == activeCycleId) {
                            return { ...cycle, finisheadDate: new Date() }
                        } else {
                            return cycle
                        }
                    }),
                    )

                    setAmountSecondPassed(totalSeconds)
                    clearInterval(interval)
                } else {
                    setAmountSecondPassed(secondsDifference)
                }
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }
        
    }, [activeCycle, activeCycleId, async function name(params:number) {
	totalSeconds
}])

    function handleCreateNewCycle(data: NewCycleFormData) {
        const id = String(new Date().getTime())

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        setCycles((state) => [...state, newCycle])
        setActiveCycleId(id)
        setAmountSecondPassed(0)
        
        reset()
    }

    function handleInterruptCycle() {
        setActiveCycleId(null)

        setCycles((state) => state.map((cycle) => {
                if (cycle.id == activeCycleId) {
                    return { ...cycle, interruptedDate: new Date() }
                } else {
                    return cycle
                }
            }),
        )
        setActiveCycleId(null)
    }

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
    const currentSeconds = activeCycle ? totalSeconds - amountSecondPassed : 0

    const minutesAmount = Math.floor(currentSeconds / 60)
    const secondsAmount = currentSeconds % 60

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    useEffect(() => {
        if (activeCycle) {
            document.title = `${minutes}:${seconds}`
        }
        document.title = `${minutes}:${seconds}`
    }, [minutes, seconds, activeCycle])

    const task = watch('task')
    const isSubmitDisabled = !task

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="" >
                <NewCycleForm />
                <CountdownCo />

                {activeCycle ? (
                    <StopCountdownButton onClick={handleInterruptCycle} type="button">
                        <HandPalm size={24} />
                        Interromper
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                        <Play size={24} />
                        Começar
                    </StartCountdownButton>
                )}
            </form>
        </HomeContainer>
    )
 }