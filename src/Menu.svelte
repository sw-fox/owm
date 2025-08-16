<script>
    import MenuIcon from "./components/MenuIcon.svelte";
    import Toggle from "./components/Toggle.svelte";

	let showMenu = false;
    function toggleMenu() {
        showMenu = !showMenu;
    }
</script>

<div class="menu">
    <div class="menu-button">
        <!--<MenuIcon toggleMenu={toggleMenu} open={showMenu}/>-->
    <button on:click={toggleMenu} class="menu-button">
        &#8801;
    </button>
</div>
    <div class="menu-content" class:open={showMenu}>
        <ul>
            <li><a href="https://github.com/sw-fox/owm"><img class="github-mark" src="images/github-mark.svg" alt=""/>Github</a></li>
            <!--<li><Toggle label="Feature"/></li>-->
        </ul>
      </div>
</div>

<style>
    .menu {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 999;
        display: flex;
        flex-direction: column;
    }
    .menu-button {
        margin-left: auto;
        margin-right: 0;
    }
    .menu-button button{
        all: unset;
        background-color: #333;
        color: #ddd;
        padding: 0.4rem 1rem;
        font-size: 1.8rem;
    }
    .menu-content {
        width: 0;
        overflow: hidden;
        background-color: #333;
        color: #ddd;
        margin-left: auto;
        margin-right: 0;
        transition: width 1s ease-in-out;
    }
    .menu-content ul {
        margin-top: 1em;
        list-style: none;
    }
    .menu-content li {
        margin-top: 0.5em;
        font-size: 1.2rem;
    }
    .menu-content a {
        color: #ddd;
    }
    .menu-content.open {
        width: 40vw;
    }
    @media (max-width: 1000px) {
        .menu-content.open {
            width: 70vw;
        }
    }
    @media (max-width: 600px) {
        .menu-content.open {
            width: calc(100vw - 3em);
        }
    }
    .github-mark{
        width: 1em;
        margin-right: 0.3em;
    }
</style>
