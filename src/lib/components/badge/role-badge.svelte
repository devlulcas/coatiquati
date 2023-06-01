<script lang="ts">
	import { Roles } from '$src/modules/user/constants/user-roles';

	export let role: string;
	export let isCurrentUser = false;
</script>

<strong
	class:bg-purple-700={role === Roles.ADMIN}
	class:bg-fuchsia-700={role === Roles.USER}
	class:bg-emerald-700={isCurrentUser}
	class="text-sm px-2 py-1 rounded-sm text-white"
>
	{role}
</strong>
