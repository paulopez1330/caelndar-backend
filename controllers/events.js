const { response } = require('express');
const Evento = require('../models/Evento');

const getEventos = async (req, res = response ) => {

  try {
    const eventos = await Evento.find()
                                .populate('user', 'name');
    
    return res.status(200).json({
      ok: true,
      eventos
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg:'Por favor hable con el administrador',
    });
  }

}

const crearEvento = async ( req, res = response ) => {
  
  const evento = new Evento( req.body );

  try {

    evento.user = req.uid;
    await evento.save();

    return res.status(201).json({
      ok: true,
      evento
    })
    
  } catch (error) {
    
    return res.status(500).json({
      ok: false,
      msg:'Por favor hable con el administrador',
    });
  }
}

const actualizarEvento = async ( req, res = response ) => {
  
  const eventoId = req.params.id;
  try {
    const evento = await Evento.findById( eventoId );
  
    if ( !evento ) {
      return res.status(404).json({
        ok: false,
        msg: 'evento no encontrado'
      });
    }

    if( evento.user.toString() !== req.uid ) {
      return res.status(401).json({
        ok: false,
        msg: 'no tiene privilegio de editar este evento'
      });
    }

    const nuevoEvento = {
      ...req.body,  
      user: req.uid
    }

    const eventoActualizado = await Evento.findOneAndUpdate( { _id: eventoId }, nuevoEvento, { new: true } );

    return res.json({
      ok: true,
      eventoActualizado
    })

  } catch (error) {
    
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg:'Por favor hable con el administrador',
    });
  }
}

const eliminarEvento = async ( req, res = response ) => {
  
  const eventoId = req.params.id;
  try {
    const evento = await Evento.findOne( { _id: eventoId } );
  
    if ( !evento ) {
      return res.status(404).json({
        ok: false,
        msg: 'evento no encontrado'
      });
    }

    if( evento.user.toString() !== req.uid ) {
      return res.status(401).json({
        ok: false,
        msg: 'no tiene privilegio de editar este evento'
      });
    }

    await Evento.findOneAndDelete( { _id: eventoId } );

    return res.json({
      ok: true
    })

  } catch (error) {
    
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg:'Por favor hable con el administrador',
    });
  }
}

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento
}