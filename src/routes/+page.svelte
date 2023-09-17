<script lang="ts">
	import '../app.css'
	import { browser } from '$app/environment'
	import _emojis, { time, size } from './emojis'

	let state: State = 'difficulty'
	let difficulty: Difficulty = 'Easy'
	let emojis: string[] = []
	let timerId: number | null = null
	let timer = time[difficulty]
	let selected: number[] = []
	let matched: number[] = []
	let startingFlip = true
	let matchCount = size[difficulty] / 2

	function setDifficulty(newDifficulty: Difficulty) {
		difficulty = newDifficulty
		matchCount = size[difficulty] / 2
		startNewGame()
	}

	function resetTime() {
		timer = time[difficulty]
		timerId && clearInterval(timerId)
		timerId = setInterval(() => {
			if (state === 'pause' || startingFlip) return
			if (state !== 'playing') return timerId && clearInterval(timerId)

			timer -= 1
			if (timer <= 0) {
				state = 'lose'
			}
		}, 1e3)
	}

	function select(index: number) {
		if (selected.length >= 2) return

		selected = selected.concat(index)
		if (selected.length > 1) {
			if (emojis[selected[0]] === emojis[selected[1]]) {
				matched = matched.concat(...selected)
				if (matched.length === size[difficulty])
					return setTimeout(() => {
						state = 'win'
					}, 300)
			}

			setTimeout(() => {
				selected = []
			}, 300)
		}
	}

	function shuffle<T>(array: T[]): void {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[array[i], array[j]] = [array[j], array[i]]
		}
	}

	function startNewGame() {
		state = 'playing'
		selected = []
		matched = []

		// setup the emojis, so every time he starts a new game the emojis changed in each game
		emojis = Array.from(
			{ length: matchCount },
			() => _emojis[Math.floor(Math.random() * _emojis.length)]
		)
		emojis = emojis.concat([...emojis]) // make another copy
		shuffle(emojis)
		resetTime()
		startingFlip = true
		setTimeout(() => (startingFlip = false), 1250)
	}

	$: {
		if (browser) {
			if (state === 'playing' && timer) {
				document.title = `Matching Game | ${timer}⏳`
			} else if (state === 'pause') {
				document.title = 'Matching Game | Paused'
			} else {
				document.title = 'Matching Game'
			}
		}
	} // optional you can remove this

	const visibilitychange = () => {
		if (state === 'playing' && document.visibilityState === 'hidden') {
			state = 'pause'
		} else if (state === 'pause') {
			state = 'playing'
		}
	} // optional for track whenever the user go outside the page or to another tab

	const keydown = (e: KeyboardEvent) => {
		if (e.key === ' ') {
			switch (state) {
				case 'playing':
					state = 'pause'
					break
				case 'pause':
					state = 'playing'
					break
				case 'difficulty':
					startNewGame()
					break
				default:
					break
			}
		} else if (e.key === 'Escape') {
			state = 'difficulty'
		}
	} // optional as well
</script>

<svelte:window on:visibilitychange={visibilitychange} on:keydown={keydown} />
<svelte:head>
	<title>Matching Game</title>
</svelte:head>

{#if state === 'difficulty'}
	<div class="flex flex-col gap-y-6 md:gap-y-8 items-center">
		<h1 class="title">Choose difficulty.</h1>
		<div class="flex flex-wrap justify-center gap-4">
			<button on:click={() => setDifficulty('Easy')} class="btn">Easy</button>
			<button on:click={() => setDifficulty('Moderate')} class="btn">Moderate</button>
			<button on:click={() => setDifficulty('Challenging')} class="btn">Challenging</button>
		</div>
	</div>
{/if}

{#if state === 'pause'}
	<div class="flex flex-col gap-y-6 md:gap-y-8 items-center">
		<h1 class="title">Paused! You have {timer}s left⏳</h1>
		<button on:click={() => (state = 'playing')} class="btn">Resume</button>
	</div>
{/if}

{#if state === 'playing'}
	<h1
		class="title text-center mb-5 md:mb-7"
		class:animate-shake={timer === 5}
		class:text-red-600={timer <= 5}
	>
		Timer {timer}⏳
	</h1>

	<div class="grid grid-cols-4 gap-4 md:gap-6">
		{#each emojis as emoji, index}
			{@const isSelected = selected.includes(index)}
			{@const isMatched = matched.includes(index)}

			<button
				disabled={isSelected || isMatched}
				class:flip={isSelected || startingFlip}
				on:click={() => select(index)}
				class="card w-20 h-16 md:w-24 md:h-20 p-2 md:p-5 text-4xl md:text-5xl rounded-lg bg-main hover:bg-main/75 duration-300"
			>
				<div class:empty={!isMatched} class:matched={isMatched}>
					{emoji}
				</div>
			</button>
		{/each}
	</div>

	<button on:click={() => (state = 'difficulty')} class="btn mt-4 mx-auto">Cancel</button>
{/if}

{#if state === 'lose'}
	<div class="flex flex-col gap-y-6 md:gap-y-8 items-center">
		<h1 class="title">You Lost. 💩</h1>
		<button on:click={startNewGame} class="btn">Play Again</button>
	</div>
{/if}

{#if state === 'win'}
	<div class="flex flex-col gap-y-6 md:gap-y-8 items-center">
		<h1 class="title">You Won. 🏆</h1>
		<button on:click={startNewGame} class="btn">Play Again</button>
	</div>
{/if}
