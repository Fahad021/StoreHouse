import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Stage2 = ({ handleChange, handleChangeStage, utility, utilities }) => {      
    let options = []
    
    utilities.forEach((u, i) => {
        options.push(<option key={i} value={u.lseId}>{u.name}</option>)
    })

    return(
        <>
            <div className="form-group utility">
                <label htmlFor="utility">Utility</label>
                <Form.Control name="utility" value={utility} onChange={handleChange} as="select" className="form-control form-control-lg">
                    {options}
                </Form.Control>
            </div>
            <Button id="next" variant="secondary" onClick={handleChangeStage}>Next</Button>
        </>
    );
};

export default Stage2;