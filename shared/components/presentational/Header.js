import React                from 'react/lib/React';
import SideNav              from './SideNav';
import AddToHome            from './AddToHome';

export default class Header extends React.Component {

    openSideNav = () => {
        this.refs.sidenav.toggleSideNav();
    }

    showAddHomeUI = () => {
        this.refs.home.show();
    } 

    render() {
        const { auth, title } = this.props;
        return (
            <div>
                <header className="header">
                    <div className="detect_header_menu" onClick={this.openSideNav}>
                        <button  className="header__menu js-toggle-menu">
                            Toggle nav menu
                        </button>
                    </div>

                    <h1 className="js-header__title header__title">{title}</h1>
                    <button onClick={this.showAddHomeUI} className="bookmark__icon js-toggle-icon">
                        <img className="home__banner" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMjMiIHZpZXdCb3g9IjAgMCAxNyAyMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEgMSkiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiPjxwYXRoIGQ9Im0xMS45IDIwLjM0M2gtOS41MmMtMS4zMTMgMC0yLjM4LS44OTQtMi4zOC0xLjk5M3YtMTYuMzU2YzAtMS4wOTkgMS4wNjgtMS45OTMgMi4zOC0xLjk5M2g5LjUxOWMxLjMxMyAwIDIuMzguODk0IDIuMzggMS45OTN2MTYuMzU2YzAgMS4wOTktMS4wNjcgMS45OTMtMi4zOCAxLjk5MyIvPjxnIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PHBhdGggZD0ibTcuMDggNi41NzR2Ny4zMDQiLz48cGF0aCBkPSJtMy4yODcgMTAuMDRoNy4zMDQiLz48L2c+PC9nPjwvc3ZnPg==" />
                    </button>
                    { auth.get('id') === null ?
                        <div>
                            <a href="https://expertmile.com/loginnew.php">
                                <button className="header-button__login">
                                    LOGIN
                                </button>
                            </a> 
                            <a href="https://expertmile.com/loginnew.php">
                                <button className="header-button__login">
                                    REGISTER
                                </button>
                            </a> 
                        </div>
                    : 
                        null 
                    }
                </header>
                <AddToHome ref="home" />
                <SideNav ref="sidenav" auth={auth}/>
            </div>
        )
    }
}