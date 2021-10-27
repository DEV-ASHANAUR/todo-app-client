import React from 'react';

const Item = (props) => {
    const {_id,item,status} = props.data;
    return (
        <div className="d-flex justify-content-between align-items-center py-3">
            <div>
                <button className={status?'btn-action complete':'btn-action pending'} onClick={()=>props.handleStatus(_id)}>
                    <span className="material-icons">
                        check
                    </span>
                </button>
            </div>
            <div className={status?'item del':'item'}>
                {item}
            </div>
            <div>
                <button className="btn-action edit" onClick={()=>props.handleEdit(_id)}>
                    <span className="material-icons">
                        edit
                    </span>
                </button>
                <button className="btn-action delete" onClick={()=>props.deleteItem(_id)}>
                    <span className="material-icons">
                        close
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Item;