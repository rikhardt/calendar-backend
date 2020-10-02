const {response} = require('express')
const Evento = require('../models/Evento')


const getEventos = async(req, res = response) => {

    try {

        const eventos = await Evento.find()
                                    .populate('user', 'name');
        
        res.json({
            ok: true,
            eventos
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor contáctese con un administrador'
        })
    }

}

const crearEvento = async(req, res = response) => {

    const evento = new Evento(req.body);

    try {

        evento.user = req.uid;
        await evento.save();

        res.json({
            ok: true,
            evento
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor contáctese con un administrador'
        })
    }

}


const actualizarEvento = async(req, res = response) => {

    const eventoId = req.params.id;    

    try {
        
        const evento = await Evento.findById(eventoId);
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        if (evento.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: req.uid
        };

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new:true})
        
        res.json({
            ok: true,
            eventoActualizado
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Por favor contáctese con un administrador'
        })
    }

}

const eliminarEvento = async(req, res = response) => {
    
    const eventoId = req.params.id
    
    try {

        const evento = await Evento.findByIdAndDelete(eventoId)
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        if (evento.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            });
        }

        res.json({ ok: true })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Por favor contáctese con un administrador'
        });
    }

}


module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}