import React,{useState,useEffect,useRef} from 'react'
import './home.css'
import { ToastContainer, toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import 'react-toastify/dist/ReactToastify.css';
import axois from 'axios';
import { Button, Modal } from 'react-bootstrap';
import Item from './Item/Item'
import axios from 'axios';
import ReactPaginate from "react-paginate";
const Home = () => {
    const [item,setItem] = useState([]);
    const [uitem,setUitem] = useState({});
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [loading,setLoading] = useState(true);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleClose1 = () => setShow1(false);
    const title = useRef();
    //for pagination 
    const [pageNumber, setPageNumber] = useState(0);
    const itemPerPage = 4;
    const pagesVisited = pageNumber * itemPerPage;
    //handleForm
    const handleForm = (e) => {
        e.preventDefault();
        const name = title.current.value;
        if(name.length < 2){
            toast.error("Please Type Something");
            return;
        }
        axois.post('https://simple-todo-ec0y.onrender.com/todo',{
            item : name,
            status : false
        }).then(result=>{
            if(result.status === 200){
                let newItem = [];
                const data = {
                    _id : result.data.insertedId,
                    item : name,
                    status : false
                }
                newItem = [...item,data];
                setItem(newItem);
                toast.success("Item Added Successfully");
                setShow(false);
            }
        }).catch(err=>{
            console.log(err);
        }); 
    }
    //get data
    useEffect(()=>{
        axios.get('https://simple-todo-ec0y.onrender.com/todo')
        .then(res=>{
            setItem(res.data);
            setLoading(false);
        });
    },[item]);
    //handleItem
    const handleItem = (e) =>{
        const item = e.target.value;
        // console.log(name);
        const upated = {...uitem};
        upated.item = item;
        setUitem(upated);
    }
    //handleEdit
    const handleEdit = (id) => {
        setShow1(true);
        const updateItem = item.find(item => item._id === id);
        setUitem(updateItem);
    }
    //https://simple-todo-ec0y.onrender.com/
    //handleUpdate
    const handleUpdate = (e) =>{
        e.preventDefault();
        if(uitem.item < 2){
            toast.error("Please Type Something");
            return;
        }
        axios.put(`https://simple-todo-ec0y.onrender.com/todo/${uitem._id}`,uitem)
        .then(res=>{
            if(res.data.modifiedCount > 0){
                toast.success('Successfuly Update Item');
                setShow1(false);
            }
        });
    }
    // handlestatus
    const handleStatus = (id) => {
        // console.log(id);
        const selectedItem = item.find(item => item._id === id);
        if(selectedItem.status === true){
            selectedItem.status = false;
            axios.put(`https://simple-todo-ec0y.onrender.com/todo/${id}`,selectedItem)
            .then(res=>{
                if(res.data.modifiedCount > 0){
                    toast('pending');
                }
            });
        }else{
            selectedItem.status = true;
            axios.put(`https://simple-todo-ec0y.onrender.com/todo/${id}`,selectedItem)
            .then(res=>{
                if(res.data.modifiedCount > 0){
                    toast.success('complated');
                }
            });
        }
        // console.log(selectedItem.status);
    }
    //handle delete item
    const deleteItem = (id) => {
        confirmAlert({
            message: 'Are you sure! You want to remove this ..',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    axios.delete(`https://simple-todo-ec0y.onrender.com/todo/${id}`)
                    .then(res=>{
                        if(res.status === 200){
                            const remainUtem = item.filter(item => item._id !== id);
                            setItem(remainUtem);
                            toast.success("Item Deleted Successfully");
                        }
                    }).catch(err=>{
                        console.log(err);
                    });
                }
              },
              {
                label: 'No',
                onClick: () => {
                    toast('Your Item is safe :)');
                }
              }
            ],
            overlayClassName: "overley"
        });
    }
    // for pagination
    const displayItem = item
    .slice(pagesVisited, pagesVisited + itemPerPage)
    .map((item,index) => {
      return (
        <Item key={index} deleteItem={deleteItem} handleStatus={handleStatus} handleEdit={handleEdit} data={item}></Item>
      );
    });
    //page count
    const pageCount = Math.ceil(item.length / itemPerPage);
    //change page handle
    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };
  return (
    <>
            <div className='banner'>
                <div className='container'>
                    <div className="row ">
                        <div className="col-md-12">
                            <div className="card m-auto my-5" style={{maxWidth: '25rem'}}>
                                <div className="card-header p-3 d-flex justify-content-between">
                                    <p className='m-0 py-2 head-title'>All Your Todos {item.length}</p>
                                    <p className='m-0 p-0'>
                                        <button className='add-btn' onClick={handleShow}>
                                            <span className="material-icons">
                                                add
                                            </span>
                                        </button>
                                    </p>
                                </div>
                                <div className="card-body">
                                   {
                                       loading? 
                                       <div className="text-center">
                                            <button className="btn btn-primary" type="button" disabled>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                Loading...
                                            </button>
                                        </div>
                                        :
                                        item.length > 0 ? displayItem : <p style={{textAlign:'center',fontWeight:'700'}}>Start Your Listing</p>
                                    }
                                    {
                                        item.length > 0 && 
                                        <ReactPaginate
                                            previousLabel={"Previous"}
                                            nextLabel={"Next"}
                                            pageCount={pageCount}
                                            onPageChange={changePage}
                                            containerClassName={"paginationBttns"}
                                            previousLinkClassName={"previousBttn"}
                                            nextLinkClassName={"nextBttn"}
                                            disabledClassName={"paginationDisabled"}
                                            activeClassName={"paginationActive"}
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* modal start */}
                <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Item</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={handleForm}>
                    <Modal.Body>
                        <input type="text" ref={title} className='form-control my-3' placeholder="Enter Item" />
                    </Modal.Body>
                    <Modal.Footer>
                       <Button type="submit" variant="primary">
                       Save Item
                        </Button>
                    </Modal.Footer>
                    </form>
                </Modal>
                {/* modal start */}
                <Modal show={show1} onHide={handleClose1} backdrop="static" keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Item</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={handleUpdate}>
                    <Modal.Body>
                        <input type="text" ref={title} onChange={handleItem} value={uitem.item || ""} className='form-control my-3' placeholder="Enter Item" />
                    </Modal.Body>
                    <Modal.Footer>
                       <Button type="submit" variant="primary">
                       Save Item
                        </Button>
                    </Modal.Footer>
                    </form>
                </Modal>
            </div>
            <ToastContainer />
        </>
  )
}

export default Home