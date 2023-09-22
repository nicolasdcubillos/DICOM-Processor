package puj.backend_gui_nodules.rest;

import puj.backend_gui_nodules.model.ImagenTacDTO;
import puj.backend_gui_nodules.service.ImagenTacService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
@RequestMapping(value = "/api/imagenTacs", produces = MediaType.APPLICATION_JSON_VALUE)
public class ImagenTacResource {

    private final ImagenTacService imagenTacService;

    public ImagenTacResource(final ImagenTacService imagenTacService) {
        this.imagenTacService = imagenTacService;
    }

    @GetMapping
    public ResponseEntity<List<ImagenTacDTO>> getAllImagenTacs() {
        return ResponseEntity.ok(imagenTacService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImagenTacDTO> getImagenTac(@PathVariable final Integer id) {
        return ResponseEntity.ok(imagenTacService.get(id));
    }

    @PostMapping
    public ResponseEntity<Integer> createImagenTac(
            @RequestBody @Valid final ImagenTacDTO imagenTacDTO) {
        final Integer createdId = imagenTacService.create(imagenTacDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateImagenTac(@PathVariable final Integer id,
            @RequestBody @Valid final ImagenTacDTO imagenTacDTO) {
        imagenTacService.update(id, imagenTacDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImagenTac(@PathVariable final Integer id) {
        imagenTacService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
