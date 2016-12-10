// tradução
// https://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html
L.drawLocal = {
  draw: {
    toolbar: {
      actions: {
        title: 'Cancelar o desenho',
        text: 'Cancelar'
      },
      finish: {
        title: 'Terminar o desenho',
        text: 'Terminar'
      },
      undo: {
        title: 'Apagar o último ponto adicionado',
        text: 'Apagar o último ponto'
      },
      buttons: {
        polyline: 'Desenhar uma linha',
        polygon: 'Desenhar um polígono',
        rectangle: 'Desenhar um retangulo',
        circle: 'Desenhar um círculo',
        marker: 'Adicionar uma marca'
      }
    },
    handlers: {
      circle: {
        tooltip: {
          start: 'Clique e arraste para desenhar um círculo'
        },
        radius: 'Radianos'
      },
      marker: {
        tooltip: {
          start: 'Clique no mapa para adicionar uma marca'
        }
      },
      polygon: {
        tooltip: {
          start: 'Clique para começar a desenhar o polígono',
          cont: 'Clique no próximo ponto para continuar',
          end: 'Clique no próximo ponto para continuar, ou em cima do primeiro ponto adicionado para terminar'
        }
      },
      polyline: {
        error: '<strong>Erro:</strong> as linhas que formam o polígono não podem se cruzar',
        tooltip: {
          start: 'Clique para começar a desenhar uma linha',
          cont: 'Clique no próximo ponto para continuar',
          end: 'Clique no próximo ponto para continuar, ou em cima do último ponto adicionado para terminar'
        }
      },
      rectangle: {
        tooltip: {
          start: 'Clique e arraste para desenhar um retângulo'
        }
      },
      simpleshape: {
        tooltip: {
          end: 'Solte o mouse para parar de desenhar'
        }
      }
    }
  },
  edit: {
    toolbar: {
      actions: {
        save: {
          title: 'Concluir as mudanças',
          text: 'Concluir'
        },
        cancel: {
          title: 'Cancelar a edição e apagar todas as mudanças',
          text: 'Cancelar'
        }
      },
      buttons: {
        edit: 'Editar',
        editDisabled: 'Não há o que editar',
        remove: 'Apagar',
        removeDisabled: 'Não há o que apagar'
      }
    },
    handlers: {
      edit: {
        tooltip: {
          text: 'Arraste os pontos ou a marca para editar',
          subtext: 'Clique em cancelar para desfazer'
        }
      },
      remove: {
        tooltip: {
          text: 'Clique no desenho ou na marca para remover'
        }
      }
    }
  }
};