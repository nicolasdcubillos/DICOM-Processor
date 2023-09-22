package puj.backend_gui_nodules.rest;

import puj.backend_gui_nodules.model.TipoRegistroDTO;
import puj.backend_gui_nodules.service.TipoRegistroService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "/api/tipoRegistros")
public class TipoRegistroResource {

    private final TipoRegistroService tipoRegistroService;

    public TipoRegistroResource(final TipoRegistroService tipoRegistroService) {
        this.tipoRegistroService = tipoRegistroService;
    }

    @GetMapping
    public ResponseEntity<List<TipoRegistroDTO>> getAllTipoRegistros() {
        return ResponseEntity.ok(tipoRegistroService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoRegistroDTO> getTipoRegistro(@PathVariable final Integer id) {
        return ResponseEntity.ok(tipoRegistroService.get(id));
    }

    @PostMapping
    public ResponseEntity<Integer> createTipoRegistro(
            @RequestBody @Valid final TipoRegistroDTO tipoRegistroDTO) {
        final Integer createdId = tipoRegistroService.create(tipoRegistroDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateTipoRegistro(@PathVariable final Integer id,
            @RequestBody @Valid final TipoRegistroDTO tipoRegistroDTO) {
        tipoRegistroService.update(id, tipoRegistroDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTipoRegistro(@PathVariable final Integer id) {
        tipoRegistroService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
