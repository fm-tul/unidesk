import { FaBeer } from 'react-icons/fa';
import { DropdownButton } from '../components/DropdownButton';

export const Styles = () => {

    const items = [
        { id: 1, name: 'Beer' },
        { id: 2, name: 'Wine' },
        { id: 3, name: 'Cocktail' },
    ]
    return (
        <div className="container mx-auto">
            <h1>Buttons</h1>

            <div className="btn-bar">
                <button className="btn btn-info">Info</button>
                <button className="btn btn-info">Info with icon<FaBeer /></button>

                <button className="btn btn-success">Success</button>
                <button className="btn btn-success">Success with icon<FaBeer /></button>

                <button className="btn btn-warning">Warning</button>
                <button className="btn btn-warning">Warning with icon<FaBeer /></button>

                <button className="btn btn-danger">Danger</button>
                <button className="btn btn-danger">Danger with icon<FaBeer /></button>

                <button className="btn btn-text">Text</button>
                <button className="btn btn-text">Text with icon<FaBeer /></button>
            </div>

            <h1>Buttons small</h1>
            <div className="btn-bar">
                <button className="btn-small btn-info">Info</button>
                <button className="btn-small btn-info">Info with icon<FaBeer /></button>

                <button className="btn-small btn-success">Success</button>
                <button className="btn-small btn-success">Success with icon<FaBeer /></button>

                <button className="btn-small btn-warning">Warning</button>
                <button className="btn-small btn-warning">Warning with icon<FaBeer /></button>

                <button className="btn-small btn-danger">Danger</button>
                <button className="btn-small btn-danger">Danger with icon<FaBeer /></button>

                <button className="btn-small btn-text">Text</button>
                <button className="btn-small btn-text">Text with icon<FaBeer /></button>
            </div>

            <h1>Button group</h1>
            <div className="btn-group">
                <button className="btn btn-info">Info</button>
                <button className="btn btn-success">Success</button>
                <button className="btn btn-warning">Warning</button>
                <button className="btn btn-danger">Danger</button>
                <button className="btn btn-text">Text</button>
            </div>

            <h1>Button group with same class</h1>
            <div className="btn-group">
                <button className="btn btn-info">Info</button>
                <button className="btn btn-info">Another Info</button>
                <button className="btn btn-info">Also Info</button>
                <button className="btn btn-info">The Last Info</button>
                <button className="btn btn-info" disabled>The Last Info</button>
            </div>

            <h1>Loading indicators</h1>
            <div className='btn-bar'>
                <span className="spinner"></span>
                <span className="spinner-colors"></span>
                <span className="spinner big"></span>
                <span className="spinner-colors big"></span>
                <button className="btn btn-info">
                    Loading
                    <span className="spinner  white"></span>
                </button>
                <button className="btn btn-warning">
                    Loading
                    <span className="spinner black"></span>
                </button>
            </div>

            <h1>Dropdowns</h1>
            <DropdownButton items={items} getId={i => i.id} getLabel={i => i.name} onChange={i => console.log(i)} />
            <h1>Dropdowns Required</h1>
            <DropdownButton items={items} getId={i => i.id} getLabel={i => i.name} onChange={i => console.log(i)} required />

        </div>
    );
}

export default Styles;