// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	type State = 'difficulty' | 'pause' | 'playing' | 'win' | 'lose'
	type Difficulty = 'Easy' | 'Moderate' | 'Challenging'

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {}
