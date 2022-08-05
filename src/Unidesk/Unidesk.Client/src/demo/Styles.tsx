import { FaBeer } from 'react-icons/fa';
import { DropdownButton } from '../components/DropdownButton';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

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
                {/* <button className="btn btn-info">Info</button>
                <button className="btn btn-info">Info with icon<FaBeer /></button>
                
                <button className="btn btn-success">Success</button>
                <button className="btn btn-success">Success with icon<FaBeer /></button>
                
                <button className="btn btn-warning">Warning</button>
                <button className="btn btn-warning">Warning with icon<FaBeer /></button>
                
                <button className="btn btn-danger">Danger</button>
                <button className="btn btn-danger">Danger with icon<FaBeer /></button>
                
                <button className="btn btn-text">Text</button>
                <button className="btn btn-text">Text with icon<FaBeer /></button> */}

                <Button variant='contained' color='info'>Info</Button>
                <Button variant='contained' color='info'>Info with icon <FaBeer /></Button>
                
                <Button variant='contained' color='success'>Success</Button>
                <Button variant='contained' color='success'>Success with icon <FaBeer /></Button>

                <Button variant='contained' color='warning'>Warning</Button>
                <Button variant='contained' color='warning'>Warning with icon <FaBeer /></Button>

                <Button variant='contained' color='error'>Danger</Button>
                <Button variant='contained' color='error'>Danger with icon <FaBeer /></Button>

                <Button variant='text'>Text</Button>
                <Button variant='text'>Text with icon <FaBeer /></Button>
            </div>

            <h1>Buttons small</h1>
            <div className="btn-bar">
                {/* <button className="btn-small btn-info">Info</button>
                <button className="btn-small btn-info">Info with icon<FaBeer /></button>

                <button className="btn-small btn-success">Success</button>
                <button className="btn-small btn-success">Success with icon<FaBeer /></button>

                <button className="btn-small btn-warning">Warning</button>
                <button className="btn-small btn-warning">Warning with icon<FaBeer /></button>

                <button className="btn-small btn-danger">Danger</button>
                <button className="btn-small btn-danger">Danger with icon<FaBeer /></button>

                <button className="btn-small btn-text">Text</button>
                <button className="btn-small btn-text">Text with icon<FaBeer /></button> */}

                <Button size="small" variant='contained' color='info'>Info</Button>
                <Button size="small" variant='contained' color='info'>Info with icon <FaBeer /></Button>

                <Button size="small" variant='contained' color='success'>Success</Button>
                <Button size="small" variant='contained' color='success'>Success with icon <FaBeer /></Button>

                <Button size="small" variant='contained' color='warning'>Warning</Button>
                <Button size="small" variant='contained' color='warning'>Warning with icon <FaBeer /></Button>

                <Button size="small" variant='contained' color='error'>Danger</Button>
                <Button size="small" variant='contained' color='error'>Danger with icon <FaBeer /></Button>

                <Button size="small" variant='text'>Text</Button>
                <Button size="small" variant='text'>Text with icon <FaBeer /></Button>
            </div>

            <h1>Button group</h1>
            {/* <div className="btn-group">
                <button className="btn btn-info">Info</button>
                <button className="btn btn-success">Success</button>
                <button className="btn btn-warning">Warning</button>
                <button className="btn btn-danger">Danger</button>
                <button className="btn btn-text">Text</button>
            </div> */}
            <ButtonGroup>
                <Button variant='contained' color='info'>Info</Button>
                <Button variant='contained' color='success'>Success</Button>
                <Button variant='contained' color='warning'>Warning</Button>
                <Button variant='contained' color='error'>Danger</Button>
                <Button variant='text'>Text</Button>
            </ButtonGroup>

            <h1>Button group with same class</h1>
            {/* <div className="btn-group">
                <button className="btn btn-info">Info</button>
                <button className="btn btn-info">Another Info</button>
                <button className="btn btn-info">Also Info</button>
                <button className="btn btn-info">The Last Info</button>
                <button className="btn btn-info" disabled>The Last Info</button>
            </div> */}
            <ButtonGroup>
                <Button variant='contained' color='info'>Info</Button>
                <Button variant='contained' color='info'>Another Info</Button>
                <Button variant='contained' color='info'>Also Info</Button>
                <Button variant='contained' color='info'>The Last Info</Button>
                <Button variant='contained' color='info' disabled>The Last Info</Button>
            </ButtonGroup>

            

            <h1>Loading indicators</h1>
            <div className='btn-bar'>
                <span className="spinner"></span>
                <span className="spinner-colors"></span>
                <span className="spinner big"></span>
                <span className="spinner-colors big"></span>
                <Button variant='contained' className='flex gap-2 items-center'>
                    Loading
                    <span className="spinner white"></span>
                </Button>
                <Button variant='text'>
                    Loading
                    <span className="spinner blue"></span>
                </Button>
            </div>

            <h1>Dropdowns</h1>
            <Select size='small' value={items[0].id}>
                {items.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
            </Select>

        </div>
    );
}

export default Styles;